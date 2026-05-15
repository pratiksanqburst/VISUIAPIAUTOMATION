import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class VisualizationDashboardPage extends BasePage {
    readonly root: Locator;
    readonly viewNonFunctionalButton: Locator;
    readonly clientSidePerformanceButton: Locator;

    constructor(page: Page) {
        super(page);
        this.root = this.page.locator('#root');
        this.viewNonFunctionalButton = this.page.getByRole('button', { name: 'View Non-Functional Testing' });
        this.clientSidePerformanceButton = this.page.getByRole('button', { name: 'Client Side Performance' });
    }

    async openNonFunctionalTesting() {
        await this.viewNonFunctionalButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(3000);
    }

    async clickClientSidePerformance() {
        await this.clientSidePerformanceButton.click();
    }

    async rootContains(text: string) {
        const content = await this.root.textContent();
        return content ? content.includes(text) : false;
    }
}
