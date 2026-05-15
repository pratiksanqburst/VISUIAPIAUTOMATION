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
        await popup.waitForLoadState('domcontentloaded');
        return popup;
    }
}
