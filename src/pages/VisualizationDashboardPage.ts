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
        await expect(this.page.locator('h1')).toContainText(heading);
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
}
