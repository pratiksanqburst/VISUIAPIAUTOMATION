import 'dotenv/config';
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../hooks/world';
import { HighAIPage } from '../pages/high_ai/HighAIPage';
import { performGoogleLogin } from '../utils/auth.setup';

const HIGH_AI_URL = 'https://dev.global-portal.qburst.build/login';

When('I navigate to the High AI portal', { timeout: 120000 }, async function (this: CustomWorld) {
    const highAiPage = new HighAIPage(this.page!);
    await highAiPage.navigate(HIGH_AI_URL);
    await this.page?.waitForLoadState('networkidle');
    
    const email = process.env.HIGH_AI_EMAIL!;
    const password = process.env.HIGH_AI_PASSWORD!;
    
    const isLoginPage = this.page?.url().includes('/login');
    if (isLoginPage) {
        console.log('Performing High AI direct login...');
        await highAiPage.login(email, password);
        await this.page?.waitForLoadState('networkidle');
    }
});

When('I open the High AI login page', async function (this: CustomWorld) {
    await this.page?.goto(HIGH_AI_URL);
    await this.page?.waitForLoadState('networkidle');
    console.log('Opened High AI login page without logging in.');
});

Then('I should be redirected to the dashboard', async function (this: CustomWorld) {
    const highAiPage = new HighAIPage(this.page!);
    const isOnPlatforms = await highAiPage.isOnPlatformsPage();
    expect(isOnPlatforms).toBe(true);
});

When('I select the {string} platform', async function (this: CustomWorld, platformName: string) {
    const highAiPage = new HighAIPage(this.page!);
    console.log(`Selecting ${platformName} platform...`);
    this.page = await highAiPage.selectVisualisation();
    await this.page?.waitForLoadState('networkidle');
});

When('I login with invalid credentials', async function (this: CustomWorld) {
    const highAiPage = new HighAIPage(this.page!);
    const email = process.env.INVALID_EMAIL!;
    const password = process.env.INVALID_PASSWORD!;
    console.log(`Attempting login with invalid email: ${email}`);
    await highAiPage.loginDirect(email, password);
});

Then('I should see an error message {string}', async function (this: CustomWorld, expectedMessage: string) {
    const highAiPage = new HighAIPage(this.page!);
    const errorText = await highAiPage.getErrorMessage();
    console.log(`Error message received: ${errorText}`);
    expect(errorText).toContain(expectedMessage);
});

When('I click Login without entering credentials', async function (this: CustomWorld) {
    const highAiPage = new HighAIPage(this.page!);
    console.log('Clicking Login with empty fields...');
    await highAiPage.clickLoginEmpty();
});

Then('I should see validation message {string}', async function (this: CustomWorld, message: string) {
    const highAiPage = new HighAIPage(this.page!);
    console.log(`Verifying validation message: ${message}`);
    await highAiPage.getValidationMessage(message);
});

Then('I should see the {string} dashboard', async function (this: CustomWorld, dashboardName: string) {
    const page = this.page!;
    console.log(`Verifying ${dashboardName} dashboard...`);
    await page.waitForTimeout(5000); // Wait for redirect to finish
    await expect(page.getByRole('button', { name: `View ${dashboardName}` })).toBeVisible();
    await page.getByRole('button', { name: `View ${dashboardName}` }).click();
    await expect(page.getByRole('heading', { name: dashboardName }).nth(1)).toBeVisible();
});

Then('I verify the dashboard metrics cards are visible:', async function (this: CustomWorld, dataTable: any) {
    const page = this.page!;
    const metrics = dataTable.raw().flat().slice(1); // Skip header if present
    for (const metric of metrics) {
        console.log(`Verifying metric: ${metric}`);
        await expect(page.getByRole('heading', { name: metric })).toBeVisible();
    }
});

Then('I wait for {int} seconds', async function (this: CustomWorld, seconds: number) {
    console.log(`Waiting for ${seconds} seconds...`);
    await this.page?.waitForTimeout(seconds * 1000);
});

Then('the URL should contain {string}', async function (this: CustomWorld, expectedPath: string) {
    console.log(`Waiting for 5 seconds before checking URL...`);
    await this.page?.waitForTimeout(10000);
    const actualUrl = this.page?.url() || '';
    console.log(`Current URL: ${actualUrl}`);
    expect(actualUrl).toContain(expectedPath);
});
