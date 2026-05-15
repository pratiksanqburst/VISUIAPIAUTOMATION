import { BasePage } from './BasePage';

export class OrganizationsPage extends BasePage {
    private CREATE_ORG_BUTTON = 'button:has-text("Create Organization")';
    private SEARCH_INPUT = 'input[placeholder*="Search" i], .search-bar input, input[type="search"]';


    private ORG_NAME_INPUT = 'input[placeholder="Acme Corporation"]';
    private ORG_CODE_INPUT = 'input[placeholder="ACME"]';
    private DESCRIPTION_INPUT = 'input[placeholder="Optional description"]';
    private PROVISIONING_MODE_SELECT = 'select.form-input';
    private PLATFORM_VIS_CHECKBOX = 'label:has-text("VIS")';
    private PLATFORM_NFT_CHECKBOX = 'label:has-text("NFT")';
    private PLATFORM_FT_CHECKBOX = 'label:has-text("FT")';
    private NEXT_BUTTON = 'button.btn-primary:has-text("Next")';


    private NFT_THREADS_INPUT = 'div:has(> label:has-text("NFT Platform")) input.form-input';
    private NFT_RUN_OPTION_WTHIN = 'label:has-text("Parallel execution within project") input';
    private NFT_RUN_OPTION_PER = 'label:has-text("Parallel execution per project") input';

    private FT_THREADS_INPUT = 'div:has(> label:has-text("FT Platform")) input.form-input';
    private FT_NLP_CHECKBOX = 'label:has-text("NLP Based Test Creation") input';
    private FINAL_CREATE_BUTTON = 'button.btn-primary:has-text("Create Organization")';
    private MODAL_OVERLAY = '.modal-backdrop';


    private SUSPEND_BUTTON = 'button[title="Suspend organization"]';
    private CONFIRM_SUSPEND_BUTTON = 'button.btn:has-text("Suspend Organization")';
    private SHOW_SUSPENDED_CHECKBOX = 'label:has-text("Show suspended") input';
    private STATUS_BADGE = '[class*="badge"]';

    async clickCreateOrganization() {
        await this.page.click(this.CREATE_ORG_BUTTON);
        await this.page.waitForTimeout(3000);
        await this.page.waitForSelector('.modal', { state: 'visible' });
    }

    async fillOrgInfo(details: { name: string, code: string, description?: string, provisioningMode?: string, platforms: string[] }) {
        await this.page.fill(this.ORG_NAME_INPUT, details.name);
        await this.page.fill(this.ORG_CODE_INPUT, details.code);
        if (details.description) {
            await this.page.fill(this.DESCRIPTION_INPUT, details.description);
        }

        if (details.provisioningMode) {
            await this.page.selectOption(this.PROVISIONING_MODE_SELECT, { label: details.provisioningMode });
        }

        await this.page.waitForTimeout(1000);
        for (const platform of ['VIS', 'NFT', 'FT']) {
            console.log(`Setting platform ${platform}...`);
            const label = this.page.locator('label').filter({ hasText: new RegExp(`^${platform}$`, 'i') });
            const checkbox = label.locator('input[type="checkbox"]');
            await checkbox.waitFor({ state: 'attached', timeout: 5000 });

            const isChecked = await checkbox.isChecked();
            if (details.platforms.includes(platform)) {
                if (!isChecked) {
                    console.log(`Checking ${platform}`);
                    await checkbox.check({ force: true });
                }
            } else {
                if (isChecked) {
                    console.log(`Unchecking ${platform}`);
                    await checkbox.uncheck({ force: true });
                }
            }
        }
    }

    async clickNext() {
        const modal = this.page.locator('.modal').first();
        const nextBtn = modal.getByRole('button', { name: /Next/i });
        await nextBtn.waitFor({ state: 'visible', timeout: 5000 });
        await nextBtn.click();
        await this.page.waitForTimeout(2000);
        await this.page.waitForSelector('label:has-text("NFT Platform")', { state: 'visible', timeout: 15000 });
    }

    async configureFeatureFlags(config: { nftThreads: string, nftRunOption: string, ftThreads: string, ftNlp: boolean }) {
        const nftSection = this.page.locator('div.mb-6, div.space-y-4').filter({ hasText: 'NFT Platform' }).first();
        if (await nftSection.isVisible()) {
            await nftSection.locator('input[type="number"]').fill(config.nftThreads);
            if (config.nftRunOption === 'within') {
                await this.page.getByLabel(/Parallel execution within project/i).first().click();
            } else {
                await this.page.getByLabel(/Parallel execution per project/i).first().click();
            }
        }

        const ftSection = this.page.locator('div.mb-6, div.space-y-4').filter({ hasText: 'FT Platform' }).first();
        if (await ftSection.isVisible()) {
            await ftSection.locator('input[type="number"]').fill(config.ftThreads);
            if (config.ftNlp) {
                await this.page.getByLabel(/NLP Based Test Creation/i).first().check();
            } else {
                const nlpCheckbox = this.page.getByLabel(/NLP Based Test Creation/i).first();
                if (await nlpCheckbox.isChecked()) {
                    await nlpCheckbox.uncheck();
                }
            }
        }
    }

    async clickFinalCreate() {
        await this.page.waitForTimeout(2000);
        await this.page.getByRole('button', { name: 'Create Organization', exact: true }).click();

        try {
            await this.page.waitForSelector('.modal', { state: 'hidden', timeout: 15000 });
        } catch (e) {
            console.log('Modal may not be hidden, continuing anyway...');
        }
        await this.page.waitForLoadState('networkidle');
    }

    async isOrganizationVisible(name: string) {
        const selector = `text=${name}`;
        try {
            await this.page.waitForSelector(selector, { state: 'visible', timeout: 5000 });
            return await this.page.isVisible(selector);
        } catch (e) {
            return false;
        }
    }

    async suspendOrganization(name: string) {
        console.log(`Suspending organization: ${name}`);
        const row = this.page.locator('tr').filter({ hasText: name }).first();
        await row.locator(this.SUSPEND_BUTTON).click();
        await this.page.waitForSelector('.modal', { state: 'visible' });
        await this.page.click(this.CONFIRM_SUSPEND_BUTTON);
        await this.page.waitForSelector('.modal', { state: 'hidden' });
    }



    async toggleShowSuspended(checked: boolean) {
        console.log(`Toggling Show Suspended to: ${checked}`);
        const checkbox = this.page.locator(this.SHOW_SUSPENDED_CHECKBOX);
        if (checked) {
            await checkbox.check();
        } else {
            await checkbox.uncheck();
        }
        await this.page.waitForTimeout(2000);
    }

    async getOrganizationStatus(name: string) {
        const row = this.page.locator('tr').filter({ hasText: name }).first();
        await row.waitFor({ state: 'visible', timeout: 5000 });
        const badge = row.locator('[class*="badge"], [class*="status"], [class*="chip"], [class*="tag"], td').filter({ hasText: /ACTIVE|SUSPENDED/i }).first();
        await badge.waitFor({ state: 'visible', timeout: 5000 });
        const text = await badge.textContent();
        const status = text?.trim() || '';
        console.log(`Found status for ${name}: [${status}]`);
        return status;
    }

    async searchOrganization(name: string) {
        console.log(`Searching for organization: ${name}`);
        const searchInput = this.page.locator(this.SEARCH_INPUT).first();
        await searchInput.waitFor({ state: 'visible', timeout: 5000 });
        await searchInput.fill('');
        await searchInput.fill(name);
        await this.page.keyboard.press('Enter');
        await this.page.waitForLoadState('networkidle');
    }

    // Open edit modal for an organization by name
    async openEditForOrganization(name: string) {
        const row = this.page.locator('tr').filter({ hasText: name }).first();
        await row.waitFor({ state: 'visible', timeout: 5000 });
        const editBtn = row.getByRole('button', { name: '✏️' });
        await editBtn.waitFor({ state: 'visible', timeout: 5000 });
        await editBtn.click();
        await this.page.waitForSelector('.modal', { state: 'visible', timeout: 5000 });
    }

    // Update organization name in edit modal (step 1)
    async updateOrganizationName(newName: string) {
        // In edit modal, find the name input - it's typically the first text input or labeled "Organization Name"
        const modal = this.page.locator('.modal').first();
        const nameInput = modal.locator('input[type="text"]').first();
        await nameInput.waitFor({ state: 'visible', timeout: 5000 });
        await nameInput.clear();
        await nameInput.fill(newName);
    }

    // Click Next in edit modal to go to step 2 (Feature Flags)
    async clickNextInEditModal() {
        const modal = this.page.locator('.modal').first();
        const nextBtn = modal.getByRole('button', { name: /Next/i });
        await nextBtn.waitFor({ state: 'visible', timeout: 5000 });
        await nextBtn.click();
        await this.page.waitForTimeout(2000);
    }

    // Save changes in edit modal (step 2)
    async saveOrganizationEdit() {
        const saveBtn = this.page.getByRole('button', { name: 'Save Changes' });
        await saveBtn.waitFor({ state: 'visible', timeout: 5000 });
        await saveBtn.click();
        await this.page.waitForSelector('.modal', { state: 'hidden', timeout: 10000 });
        await this.page.waitForLoadState('networkidle');
    }

    // Verify organization name is visible in its row
    async isOrganizationNameVisible(oldName: string, newName: string) {
        const row = this.page.locator('tr').filter({ hasText: newName }).first();
        await row.waitFor({ state: 'visible', timeout: 5000 });
        return await row.locator(`text=${newName}`).isVisible();
    }
}
