import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { CustomWorld } from '../hooks/world';
import { LoginPage } from '../pages/LoginPage';
import { VisualizationPage } from '../pages/VisualizationPage';
import { VisualizationDashboardPage } from '../pages/VisualizationDashboardPage';
import * as fs from 'fs';

const BASE_URL = process.env.VIS_BASE_URL || process.env.BASE_URL || 'https://dev.global-portal.qburst.build/';
const EMAIL = process.env.VIS_EMAIL || process.env.GOOGLE_LOGIN_EMAIL;
const PASS = process.env.VIS_PASSWORD || process.env.GOOGLE_LOGIN_PASSWORD;

Given('I am on the visualization login page', async function (this: CustomWorld) {
    await this.page?.goto(`${BASE_URL}login`);
});

When('I sign in as a visualization user', { timeout: 120000 }, async function (this: CustomWorld) {
    if (!EMAIL || !PASS) {
        throw new Error('Visualization credentials are not set in environment variables. Please set VIS_EMAIL and VIS_PASSWORD.');
    }

    const loginPage = new LoginPage(this.page!);
    await loginPage.login(EMAIL, PASS);

    // wait for navigation after login
    await this.page?.waitForLoadState('networkidle');
});

When('I open the Visualization platform and view Non-Functional Testing', async function (this: CustomWorld) {
    const viz = new VisualizationPage(this.page!);
    const popup = await viz.startVisualizationAndReturnPopup();

    // attach popup page to world for further checks
    this.page = popup;

    const dashboard = new VisualizationDashboardPage(this.page!);
    await dashboard.openNonFunctionalTesting();
});

When('I open the Visualization platform dashboard', async function (this: CustomWorld) {
    const viz = new VisualizationPage(this.page!);
    const popup = await viz.startVisualizationAndReturnPopup();
    this.page = popup;
});

Then('I should see Accessibility, Client Side Performance, Link Validation, Search Engine Optimization and Visual Regression listed', async function (this: CustomWorld) {
    const dashboard = new VisualizationDashboardPage(this.page!);

    expect(await dashboard.rootContains('Accessibility')).to.be.true;
    expect(await dashboard.rootContains('Client Side Performance')).to.be.true;
    expect(await dashboard.rootContains('Link Validation')).to.be.true;
    expect(await dashboard.rootContains('Search Engine Optimization')).to.be.true;
    expect(await dashboard.rootContains('Visual Regression')).to.be.true;
});

Then('the AI Summary button should be clearly visible on the dashboard', async function (this: CustomWorld) {
    const dashboard = new VisualizationDashboardPage(this.page!);
    console.log('Verifying AI Quality Summary button is visible...');
    await dashboard.isAISummaryButtonVisible();
});

When('I click the AI Summary button', async function (this: CustomWorld) {
    const dashboard = new VisualizationDashboardPage(this.page!);
    console.log('Clicking AI Quality Summary button...');
    await dashboard.clickAISummaryButton();
});

Then('the AI Summary panel should open', async function (this: CustomWorld) {
    const dashboard = new VisualizationDashboardPage(this.page!);
    console.log('Verifying AI Summary panel opened with Functional and Non-Functional summaries...');
    await dashboard.isAISummaryPanelOpen();
});

When('I observe the Project Health Overview KPI values', async function (this: CustomWorld) {
    const dashboard = new VisualizationDashboardPage(this.page!);
    console.log('Capturing Project Health Overview KPI values...');
    this.kpiValues = await dashboard.getProjectHealthKPIValues();
});

Then('the AI Quality Summary values should match the Project Health Overview KPI values', async function (this: CustomWorld) {
    const dashboard = new VisualizationDashboardPage(this.page!);
    console.log('Comparing AI Quality Summary values with KPI values...');
    await dashboard.verifyAISummaryMatchesKPI(this.kpiValues);
});

When('I navigate to the Functional Testing dashboard', async function (this: CustomWorld) {
    const dashboard = new VisualizationDashboardPage(this.page!);
    console.log('Navigating to Functional Testing dashboard...');
    await dashboard.openFunctionalTesting();
});

Then('I should see the following functional KPIs:', async function (this: CustomWorld, dataTable: any) {
    const dashboard = new VisualizationDashboardPage(this.page!);
    const kpis: string[] = dataTable.raw().flat().slice(1); // skip header row
    console.log('Verifying functional KPIs:', kpis);
    await dashboard.verifyFunctionalKPIs(kpis);
});

When('I navigate to the Admin Panel via Settings', async function (this: CustomWorld) {
    const dashboard = new VisualizationDashboardPage(this.page!);
    console.log('Navigating to Admin Panel via Settings...');
    await dashboard.openAdminPanel();
});

Then('I should see the heading {string}', async function (this: CustomWorld, heading: string) {
    const dashboard = new VisualizationDashboardPage(this.page!);
    console.log(`Verifying heading: ${heading}`);
    await dashboard.verifyAdminPanelHeading(heading);
});

Then('the Admin Panel table should have the following columns:', async function (this: CustomWorld, dataTable: any) {
    const dashboard = new VisualizationDashboardPage(this.page!);
    const columns: string[] = dataTable.raw().flat().slice(1); // skip header row
    console.log('Verifying table columns:', columns);
    await dashboard.verifyAdminPanelColumns(columns);
});

Then('the Refresh button should be visible', async function (this: CustomWorld) {
    const dashboard = new VisualizationDashboardPage(this.page!);
    console.log('Verifying Refresh button is visible...');
    await dashboard.verifyRefreshButtonVisible();
});

When('I navigate to Threshold Settings via Settings', async function (this: CustomWorld) {
    const dashboard = new VisualizationDashboardPage(this.page!);
    console.log('Navigating to Threshold Settings...');
    await dashboard.openThresholdSettings();
});

Then('the Threshold Settings page should contain the following sections:', async function (this: CustomWorld, dataTable: any) {
    const dashboard = new VisualizationDashboardPage(this.page!);
    const sections: string[] = dataTable.raw().flat().slice(1);
    console.log('Verifying Threshold Settings sections:', sections);
    await dashboard.verifyThresholdSettingsSections(sections);
});

Then('the Threshold Settings table should contain the following columns:', async function (this: CustomWorld, dataTable: any) {
    const dashboard = new VisualizationDashboardPage(this.page!);
    const columns: string[] = dataTable.raw().flat().slice(1);
    console.log('Verifying Threshold Settings columns:', columns);
    await dashboard.verifyThresholdSettingsColumns(columns);
});

When('I navigate to RRI Analysis via Settings', async function (this: CustomWorld) {
    const dashboard = new VisualizationDashboardPage(this.page!);
    console.log('Navigating to RRI Analysis...');
    await dashboard.openRRIAnalysis();
});

Then('the RRI Analysis page should contain the following sections:', async function (this: CustomWorld, dataTable: any) {
    const dashboard = new VisualizationDashboardPage(this.page!);
    const sections: string[] = dataTable.raw().flat().slice(1);
    console.log('Verifying RRI Analysis sections:', sections);
    await dashboard.verifyRRIAnalysisSections(sections);
});

Then('the search field {string} should be visible', async function (this: CustomWorld, placeholder: string) {
    const dashboard = new VisualizationDashboardPage(this.page!);
    await dashboard.verifySearchFieldVisible(placeholder);
});
