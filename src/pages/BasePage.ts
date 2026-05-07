import { Page } from '@playwright/test';

export class BasePage {
    constructor(protected page: Page) { }

    async navigate(path: string) {
        await this.page.goto(path);
    }

    async getTitle() {
        return await this.page.title();
    }

    async waitForElement(selector: string) {
        await this.page.waitForSelector(selector);
    }
}
