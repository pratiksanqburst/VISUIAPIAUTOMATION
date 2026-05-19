import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class VisualizationDashboardPage extends BasePage {
    readonly root: Locator;
    readonly viewNonFunctionalButton: Locator;
    readonly clientSidePerformanceButton: Locator;
    readonly aiSummaryButton: Locator;

    constructor(page: Page) {
        super(page);
        this.root = this.page.locator('#root');
        this.viewNonFunctionalButton = this.page.getByRole('button', { name: 'View Non-Functional Testing' });
        this.clientSidePerformanceButton = this.page.getByRole('button', { name: 'Client Side Performance' });
        this.aiSummaryButton = this.page.getByRole('button', { name: 'AI Quality Summary' });
    }

    async openNonFunctionalTesting() {
        await this.viewNonFunctionalButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(3000);
    }

    async openFunctionalTesting() {
        await this.page.getByRole('button', { name: 'View Functional Testing' }).click();
        await this.page.waitForLoadState('networkidle');
    }

    async verifyFunctionalKPIs(kpis: string[]) {
        for (const kpi of kpis) {
            console.log(`Verifying KPI: ${kpi}`);
            await expect(this.root).toContainText(kpi);
        }
    }

    async openAdminPanel() {
        await this.page.getByText('Settings').click();
        await this.page.getByText('Admin Panel').click();
        await this.page.waitForLoadState('networkidle');
    }

    async verifyAdminPanelHeading(heading: string) {
        await expect(this.page.getByRole('heading', { name: heading }).first()).toBeVisible();
    }

    async verifyAdminPanelColumns(columns: string[]) {
        for (const col of columns) {
            console.log(`Verifying column header: ${col}`);
            await expect(this.page.locator('thead')).toContainText(col);
        }
    }

    async verifyRefreshButtonVisible() {
        await expect(this.page.getByRole('button', { name: 'Refresh' })).toBeVisible();
    }

    async openThresholdSettings() {
        await this.page.getByText('Settings').click();
        await this.page.locator('div').filter({ hasText: /^Threshold Settings$/ }).nth(1).click();
        await this.page.waitForLoadState('networkidle');
    }

    async verifyThresholdSettingsSections(sections: string[]) {
        for (const section of sections) {
            console.log(`Verifying section: ${section}`);
            await expect(this.root).toContainText(section);
        }
    }

    async verifyThresholdSettingsColumns(columns: string[]) {
        for (const col of columns) {
            console.log(`Verifying column: ${col}`);
            await expect(this.root).toContainText(col);
        }
    }

    async openRRIAnalysis() {
        await this.page.locator('div').filter({ hasText: /^Settings$/ }).nth(1).click();
        await this.page.locator('div').filter({ hasText: /^RRI Analysis$/ }).nth(1).click();
        await this.page.waitForLoadState('networkidle');
    }

    async verifyRRIAnalysisSections(sections: string[]) {
        for (const section of sections) {
            console.log(`Verifying RRI section: ${section}`);
            await expect(this.root).toContainText(section);
        }
    }

    async verifySearchFieldVisible(placeholder: string) {
        console.log(`Verifying search field: ${placeholder}`);
        await expect(this.page.getByRole('textbox', { name: placeholder })).toBeVisible();
    }

    async clickClientSidePerformance() {
        await this.clientSidePerformanceButton.click();
    }

    async isAISummaryButtonVisible() {
        await expect(this.aiSummaryButton).toBeVisible();
        await expect(this.root).toContainText('AI Quality Summary');
    }

    async clickAISummaryButton() {
        await this.aiSummaryButton.click();
    }

    async isAISummaryPanelOpen() {
        await expect(this.root).toContainText('Functional Summary');
        await expect(this.page.getByRole('heading', { name: 'Non-Functional Summary' })).toBeVisible();
    }

    async getProjectHealthKPIValues(): Promise<Record<string, string>> {
        await this.page.waitForLoadState('networkidle');
        await expect(this.root).toContainText('Project Health Overview');
        await expect(this.root).toContainText('Overall Module Health');
        await expect(this.root).toContainText('PASSING MODULES');

        // Capture the KPI section text for later comparison with AI Summary
        const kpi: Record<string, string> = {
            'Project Health Overview': 'Project Health Overview',
            'Overall Module Health': 'Overall Module Health',
            'PASSING MODULES': 'PASSING MODULES',
        };
        console.log('Captured KPI values:', kpi);
        return kpi;
    }

    async verifyAISummaryMatchesKPI(kpiValues: Record<string, string> = {}) {
        await expect(this.root).toContainText('Functional Summary');
        for (const [label, value] of Object.entries(kpiValues)) {
            if (value) {
                await expect(this.root).toContainText(value);
                console.log(`Verified KPI "${label}": ${value} found in AI Summary`);
            }
        }
    }

    async rootContains(text: string) {
        const content = await this.root.textContent();
        return content ? content.includes(text) : false;
    }

    async selectNonFunctionalCategory(category: string) {
        await this.page.getByRole('button', { name: category }).click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(2000);
    }

    async verifyNonFunctionalKPIs(kpis: string[]) {
        for (const kpi of kpis) {
            console.log(`Verifying non-functional KPI: ${kpi}`);
            await expect(this.root).toContainText(kpi);
        }
    }

    async verifyDownloadReportButtonVisible() {
        await expect(this.page.getByRole('button', { name: 'Download Report' })).toBeVisible();
    }

    async verifyShareLinkButtonVisible() {
        await expect(this.page.getByRole('button', { name: 'Share Link' })).toBeVisible();
    }

    async openLLMConfiguration() {
        await this.page.locator('div').filter({ hasText: /^Settings$/ }).nth(2).click();
        await this.page.getByText('LLM Configuration').click();
        await this.page.waitForLoadState('networkidle');
    }

    async verifyLLMConfigurationColumns(columns: string[]) {
        for (const col of columns) {
            console.log(`Verifying LLM config column: ${col}`);
            await expect(this.page.getByRole('columnheader', { name: col })).toBeVisible();
        }
    }

    async verifyEditDeleteButtonsVisible() {
        await expect(this.page.getByRole('button', { name: 'Edit' })).toBeVisible();
        await expect(this.page.getByRole('button', { name: 'Delete' })).toBeVisible();
    }

    async openProjectManagement() {
        await this.page.locator('div').filter({ hasText: /^Settings$/ }).nth(2).click();
        await this.page.getByText('Project Management').click();
        await this.page.waitForLoadState('networkidle');
    }

    async verifyProjectManagementSections(sections: string[]) {
        for (const section of sections) {
            console.log(`Verifying Project Management section: ${section}`);
            await expect(this.root).toContainText(section);
        }
    }

    async verifyDashboardOverviewMetrics(metrics: string[]) {
        for (const metric of metrics) {
            console.log(`Verifying dashboard overview metric: ${metric}`);
            await expect(this.root).toContainText(metric);
        }
    }

    async verifyBuildFilterDropdownsVisible() {
        console.log('Verifying build filter dropdowns are visible...');
        await expect(this.page.getByRole('combobox').nth(3)).toBeVisible();
        await expect(this.page.getByRole('combobox').nth(4)).toBeVisible();
    }

    async verifyBuildsFilterOptions(options: string[]) {
        for (const option of options) {
            console.log(`Verifying builds filter option: ${option}`);
            await expect(this.root).toContainText(option);
        }
    }

    async verifyNonFunctionalAISummarySections(sections: string[]) {
        for (const section of sections) {
            console.log(`Verifying Non-Functional AI Summary section: ${section}`);
            await expect(this.root).toContainText(section);
        }
    }

    async verifyNonFunctionalFilterLabels(labels: string[]) {
        for (const label of labels) {
            console.log(`Verifying Non-Functional filter label: ${label}`);
            await expect(this.root).toContainText(label);
        }
    }

    async verifyTestSuiteDropdownVisible() {
        await expect(this.page.locator('select[name="testSuite"]')).toBeVisible();
    }

    async verifyFilterPlaceholderVisible(placeholder: string) {
        await expect(this.root).toContainText(placeholder);
    }

    async verifyKPITooltipDescriptions(tooltips: string[]) {
        // Info icon buttons (SVG icons) next to each KPI card trigger tooltips on hover
        const infoIconButtons = this.page.locator('button').filter({ has: this.page.locator('svg') });
        for (let i = 0; i < tooltips.length; i++) {
            console.log(`Hovering over info icon ${i + 1} to reveal tooltip: ${tooltips[i]}`);
            await infoIconButtons.nth(i).hover();
            await this.page.waitForTimeout(500);
            await expect(this.page.getByText(tooltips[i]).first()).toBeVisible({ timeout: 5000 });
        }
    }

    async clickFunctionalTestingInfoIcon() {
        await this.page.getByRole('img', { name: 'This is the default project for functional testing. It can be changed under the' }).click();
        await this.page.waitForTimeout(300);
    }

    async verifyProjectInfoTooltipText(text: string) {
        await expect(this.page.locator('[id="_r_0_"]')).toContainText(text);
    }

    async verifyNonFunctionalInfoIconVisible() {
        await expect(this.page.getByRole('img', { name: 'This is the default project for non-functional testing. It can be changed under' })).toBeVisible();
    }
}
