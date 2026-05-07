import { expect } from '@playwright/test';
import { BasePage } from '../BasePage';

export class HighAIPage extends BasePage {
    // Selectors from screenshot
    private EMAIL_INPUT = 'input[placeholder*="email" i]';
    private PASSWORD_INPUT = 'input[type="password"]';
    private LOGIN_BUTTON = 'button:has-text("Login")';

    // Platform selection
    private VISUALISATION_GET_STARTED = '#platform-card-vis >> button:has-text("Get Started")';

    // Dashboard selectors
    private VIEW_FUNCTIONAL_TESTING = 'button:has-text("View Functional Testing")';
    private FUNCTIONAL_TESTING_HEADING = 'role=heading[name="Functional Testing"]';

    async login(email: string, pass: string) {
        await this.page.fill(this.EMAIL_INPUT, email);
        await this.page.fill(this.PASSWORD_INPUT, pass);
        await this.page.click(this.LOGIN_BUTTON);
    }

    async loginDirect(email: string, pass: string) {
        await this.page.getByRole('textbox', { name: 'Email' }).fill(email);
        await this.page.getByRole('textbox', { name: 'Password' }).fill(pass);
        await this.page.getByRole('button', { name: 'Login' }).click();
    }

    async getErrorMessage() {
        const errorEl = this.page.locator('[id="1"]');
        await errorEl.waitFor({ state: 'visible', timeout: 10000 });
        return await errorEl.textContent();
    }

    async clickLoginEmpty() {
        await this.page.getByRole('button', { name: 'Login' }).click();
    }

    async getValidationMessage(message: string) {
        const root = this.page.locator('#root');
        await expect(root).toContainText(message);
    }

    async selectVisualisation() {
        const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page'),
            this.page.click(this.VISUALISATION_GET_STARTED)
        ]);
        return newPage;
    }

    async verifyMetricVisible(page: any, metricName: string) {
        const heading = page.getByRole('heading', { name: metricName });
        await expect(heading).toBeVisible();
    }

    async isOnPlatformsPage() {
        if (!this.page) return false;
        try {
            await this.page.waitForSelector('text=Choose Your Platform', { timeout: 10000 });
            return true;
        } catch (e) {
            return false;
        }
    }
}
