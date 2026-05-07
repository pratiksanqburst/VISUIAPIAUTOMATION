import { Before, After, BeforeAll, AfterAll, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, Browser } from '@playwright/test';
import { CustomWorld } from './world';
import * as fs from 'fs';
import * as path from 'path';

let browser: Browser;
const STORAGE_STATE_PATH = path.join(process.cwd(), 'storageState.json');

setDefaultTimeout(30000);

BeforeAll(async function () {
    browser = await chromium.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
});

async function ensureBrowser() {
    if (!browser || !browser.isConnected()) {
        console.log('Browser disconnected. Relaunching...');
        browser = await chromium.launch({ 
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox'] 
        });
    }
}

Before(async function (this: CustomWorld, scenario) {
    console.log(`\n[SCENARIO START] ${scenario.pickle.name}`);
    await ensureBrowser();
    
    const options = fs.existsSync(STORAGE_STATE_PATH) 
        ? { storageState: STORAGE_STATE_PATH } 
        : {};
    
    const videoDir = path.join(process.cwd(), 'reports/videos', scenario.pickle.name.replace(/\s+/g, '_'));
    
    try {
        this.context = await browser.newContext({
        ...options,
        viewport: { width: 1920, height: 1080 },
        recordVideo: {
            dir: videoDir,
            size: { width: 1280, height: 720 }
        }
    });

        await this.context.tracing.start({ screenshots: true, snapshots: true, sources: true });
    
        this.page = await this.context.newPage();
    } catch (error) {
        console.error('Failed to create browser context or page:', error);
        throw error;
    }
});

After(async function (this: CustomWorld, scenario) {
    console.log(`[SCENARIO END] ${scenario.pickle.name} - Result: ${scenario.result?.status}`);
    const tracePath = path.join(process.cwd(), 'reports/traces', `${scenario.pickle.name.replace(/\s+/g, '_')}.zip`);
    await this.context?.tracing.stop({ path: tracePath });

    if (scenario.result?.status === Status.FAILED) {
        const screenshot = await this.page?.screenshot();
        if (screenshot) {
            await this.attach(screenshot, 'image/png');
        }
    }

    this.attach(`Trace saved at: ${tracePath}`, 'text/plain');

    await this.page?.close();
    
    const video = this.page?.video();
    if (video) {
        try {
            const videoPath = await video.path();
            if (videoPath && fs.existsSync(videoPath)) {
                const videoBuffer = fs.readFileSync(videoPath);
                this.attach(videoBuffer, 'video/webm');
            }
        } catch (error) {
            console.log(`Video not available for scenario: ${scenario.pickle.name}`);
        }
    }

    await this.context?.storageState({ path: STORAGE_STATE_PATH });
    
    await this.context?.close();
});

AfterAll(async function () {
    await browser.close();
});
