import { request, APIRequestContext, chromium } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

export class HighAIApi {
    // Static cache: shared across ALL instances within the same Node.js process
    private static sharedContext: APIRequestContext | null = null;
    private static initPromise: Promise<APIRequestContext> | null = null;

    private readonly BASE_URL    = 'https://api.dev.visual.qburst.build';
    private readonly PORTAL_URL  = 'https://api.dev.global-portal.qburst.build';
    private readonly PORTAL_APP  = 'https://dev.global-portal.qburst.build';
    private readonly STORAGE_STATE_PATH = path.join(process.cwd(), 'storageState.json');

    private getCachedVizCookie(): string | null {
        if (!fs.existsSync(this.STORAGE_STATE_PATH)) return null;
        const storageState = JSON.parse(fs.readFileSync(this.STORAGE_STATE_PATH, 'utf-8'));
        const cookie = storageState.cookies?.find(
            (c: any) => c.domain === 'api.dev.visual.qburst.build' && c.name === 'viz_access_token'
        );
        if (!cookie) return null;
        // Decode JWT and check its own exp claim (browser-side expiry is unreliable)
        try {
            const payload = JSON.parse(Buffer.from(cookie.value.split('.')[1], 'base64').toString());
            if (payload.exp && payload.exp < Date.now() / 1000) return null;
        } catch { /* not a JWT — fall through and use it */ }
        return cookie.value;
    }

    private async getFreshVizCookie(): Promise<string> {
        const email    = process.env.VIS_EMAIL    || '';
        const password = process.env.VIS_PASSWORD || '';
        if (!email || !password) {
            throw new Error('HighAIApi: VIS_EMAIL and VIS_PASSWORD must be set in .env');
        }

        console.log('HighAIApi: viz_access_token expired — refreshing via headless browser login...');
        const browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const context = await browser.newContext();
        const page    = await context.newPage();

        try {
            // Step 1: Log into the portal
            await page.goto(`${this.PORTAL_APP}/login`);
            await page.fill('input[placeholder*="email" i]', email);
            await page.fill('input[type="password"]', password);
            await page.click('button:has-text("Login")');
            await page.waitForLoadState('networkidle', { timeout: 30000 });

            // Step 2: Click "Get Started" on the Visualization platform card (opens new tab)
            const getStartedBtn = page.locator('#platform-card-vis button:has-text("Get Started")');
            const [newPage] = await Promise.all([
                context.waitForEvent('page', { timeout: 15000 }),
                getStartedBtn.click(),
            ]);
            await newPage.waitForLoadState('networkidle', { timeout: 30000 });

            // Step 3: Extract viz_access_token from cookies
            const cookies = await context.cookies();
            const vizCookie = cookies.find(
                (c) => c.name === 'viz_access_token' && c.domain.includes('visual.qburst.build')
            );
            if (!vizCookie) {
                throw new Error('HighAIApi: viz_access_token cookie not found after browser login. Check VIS_EMAIL / VIS_PASSWORD.');
            }

            // Step 4: Persist updated cookies so UI tests benefit too
            await context.storageState({ path: this.STORAGE_STATE_PATH });
            console.log('HighAIApi: viz_access_token refreshed and saved to storageState.json');

            return vizCookie.value;
        } finally {
            await browser.close();
        }
    }

    private async getVizCookie(): Promise<string> {
        const cached = this.getCachedVizCookie();
        if (cached) return cached;
        return this.getFreshVizCookie();
    }

    async getRequestContext(): Promise<APIRequestContext> {
        // Only one initialization runs even if multiple scenarios call concurrently
        if (!HighAIApi.sharedContext) {
            if (!HighAIApi.initPromise) {
                HighAIApi.initPromise = (async () => {
                    const vizToken = await this.getVizCookie();
                    HighAIApi.sharedContext = await request.newContext({
                        baseURL: this.BASE_URL,
                        extraHTTPHeaders: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'Cookie': `viz_access_token=${vizToken}`,
                        },
                    });
                    return HighAIApi.sharedContext;
                })();
            }
            await HighAIApi.initPromise;
        }
        return HighAIApi.sharedContext!;
    }

    async getProjects() {
        const context = await this.getRequestContext();
        return await context.get('/api/projects');
    }

    async getProfile() {
        const context = await this.getRequestContext();
        return await context.get('/profile');
    }

    async getLLMConfig() {
        const context = await this.getRequestContext();
        return await context.get('/api/llm-config');
    }

    async getRBACUsers() {
        const context = await this.getRequestContext();
        return await context.get('/api/rbac/users');
    }

    async login(email: string, password: string) {
        const portalContext = await request.newContext({
            baseURL: 'https://api.dev.global-portal.qburst.build',
            extraHTTPHeaders: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });
        return await portalContext.post('/auth/login', {
            data: { email, password },
        });
    }

    async dispose() {
        if (HighAIApi.sharedContext) {
            await HighAIApi.sharedContext.dispose();
            HighAIApi.sharedContext = null;
            HighAIApi.initPromise   = null;
        }
    }
}
