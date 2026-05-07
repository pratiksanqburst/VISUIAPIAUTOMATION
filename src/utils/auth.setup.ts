import { chromium, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export const STORAGE_STATE_PATH = path.join(process.cwd(), 'storageState.json');

export async function performGoogleLogin(email: string, pass: string) {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        await page.goto('https://admin.dev.global-portal.qburst.build/login');
        await page.click('button:has-text("Sign in with Google")');

        await page.waitForSelector('input[type="email"]');
        await page.fill('input[type="email"]', email);
        await page.click('#identifierNext');

        await page.waitForSelector('input[type="password"]', { state: 'visible', timeout: 60000 });
        await page.fill('input[type="password"]', pass);
        await page.click('#passwordNext');

        console.log('Waiting for manual 2FA and redirection...');
        await page.waitForURL('**/', { timeout: 120000 });
        
        await page.waitForSelector('h1:has-text("Dashboard")', { timeout: 10000 });

        await context.storageState({ path: STORAGE_STATE_PATH });
        console.log('Authentication state saved to:', STORAGE_STATE_PATH);

    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    } finally {
        await browser.close();
    }
}
