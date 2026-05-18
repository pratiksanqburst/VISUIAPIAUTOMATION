import { BasePage } from './BasePage';
import { Page } from '@playwright/test';

export class VisualizationPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    // Clicks the Get Started button on the platform card and returns the opened popup page
    async startVisualizationAndReturnPopup() {
        const popupPromise = this.page.waitForEvent('popup');
        await this.page.locator('#platform-card-vis').getByRole('button', { name: 'Get Started' }).click();
        const popup = await popupPromise;
        // Wait for the auth redirect to complete and land on the dashboard
        await popup.waitForURL('**/dashboard**', { timeout: 60000 });
        await popup.waitForLoadState('networkidle');
        return popup;
    }
}
