import { BasePage } from './BasePage';

export class UsersPage extends BasePage {
    private CREATE_USER_BUTTON = 'button:has-text("Create User")';
    private SEARCH_INPUT = 'input[placeholder*="Search" i], .search-bar input, input[type="search"]';
    

    private EMAIL_INPUT = 'input[placeholder="user@example.com"]';
    private NAME_INPUT = 'input[placeholder="John Doe"]';
    private ORG_SELECT = '.modal select.form-input';
    private ROLE_SELECT = '.modal select.form-input'; // Will use nth(1)
    private ADD_ORG_BUTTON = '.modal button:has-text("+ Add Organization")';
    private FINAL_CREATE_BUTTON = '.modal button.btn-primary:has-text("Create")';


    private DEACTIVATE_BUTTON = 'button[title="Deactivate user"]';
    private CONFIRM_DEACTIVATE_BUTTON = 'button.btn:has-text("Deactivate User")';
    private SHOW_DISABLED_CHECKBOX = 'label:has-text("Show disabled users") input';
    private STATUS_BADGE = '[class*="badge"]';

    async clickCreateUser() {
        await this.page.getByRole('button', { name: '+ Create User' }).click();
        await this.page.waitForSelector('.modal', { state: 'visible' });
        await this.page.waitForTimeout(3000);
    }

    async fillUserDetails(details: { email: string, name: string }) {
        await this.page.fill(this.EMAIL_INPUT, details.email);
        await this.page.fill(this.NAME_INPUT, details.name);
    }

    async selectOrganizationAndRole(org: string, role: string) {
        await this.page.locator(this.ORG_SELECT).first().selectOption({ label: org });
        await this.page.locator(this.ROLE_SELECT).nth(1).selectOption({ label: role });
    }

    async getRandomOrganization() {
        await this.page.waitForSelector(this.ORG_SELECT, { state: 'visible' });

        await this.page.waitForFunction((selector) => {
            const select = document.querySelector(selector) as HTMLSelectElement;
            return select && select.options.length > 1;
        }, this.ORG_SELECT);

        const options = await this.page.locator(this.ORG_SELECT).first().locator('option').allTextContents();
        const validOptions = options.filter(opt => opt !== 'Select Organization' && opt.trim() !== '');
        if (validOptions.length === 0) return null;
        return validOptions[Math.floor(Math.random() * validOptions.length)];
    }

    async clickCreate() {
        await this.page.waitForTimeout(2000);
        const createBtn = this.page.locator(this.FINAL_CREATE_BUTTON).last();
        await createBtn.waitFor({ state: 'visible', timeout: 5000 });
        await createBtn.click();
        
        try {
            const continueBtn = this.page.getByRole('button', { name: 'Continue' });
            await continueBtn.waitFor({ state: 'visible', timeout: 15000 });
            await continueBtn.click();
        } catch (e) {
            console.log('No Continue button found or timed out waiting for it.');
        }

        try {
            await this.page.waitForSelector('.modal', { state: 'hidden', timeout: 15000 });
        } catch (e) {
            const modalContent = await this.page.locator('.modal').textContent();
            console.error(`Modal still visible. Modal content: ${modalContent?.substring(0, 500)}`);
            throw e;
        }
        await this.page.waitForLoadState('networkidle');
    }

    async isUserVisible(email: string) {
        return await this.page.isVisible(`text=${email}`);
    }

    async deactivateUser(email: string) {
        const row = this.page.locator('tr').filter({ hasText: email }).first();
        await row.locator(this.DEACTIVATE_BUTTON).click();
        await this.page.waitForSelector('.modal', { state: 'visible' });
        await this.page.click(this.CONFIRM_DEACTIVATE_BUTTON);
        await this.page.waitForSelector('.modal', { state: 'hidden' });
    }



    async toggleShowDisabled(checked: boolean) {
        console.log(`Toggling Show Disabled to: ${checked}`);
        const checkbox = this.page.locator(this.SHOW_DISABLED_CHECKBOX);
        if (checked) {
            await checkbox.check();
        } else {
            await checkbox.uncheck();
        }
        await this.page.waitForTimeout(2000);
    }

    async getUserStatus(email: string) {
        const row = this.page.locator('tr').filter({ hasText: email }).first();
        await row.waitFor({ state: 'visible', timeout: 5000 });
        const badge = row.locator('[class*="badge"], [class*="status"], [class*="chip"], [class*="tag"], td').filter({ hasText: /ACTIVE|DISABLED/i }).first();
        await badge.waitFor({ state: 'visible', timeout: 5000 });
        const text = await badge.textContent();
        const status = text?.trim() || '';
        console.log(`Found status for ${email}: [${status}]`);
        return status;
    }

    async searchUser(email: string) {
        console.log(`Searching for user: ${email}`);
        const searchInput = this.page.locator(this.SEARCH_INPUT).first();
        await searchInput.waitFor({ state: 'visible', timeout: 5000 });
        await searchInput.fill('');
        await searchInput.fill(email);
        await this.page.keyboard.press('Enter');
        await this.page.waitForLoadState('networkidle');
    }
}
