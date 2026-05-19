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

When('I navigate to the Non-Functional Testing dashboard', async function (this: CustomWorld) {
    const dashboard = new VisualizationDashboardPage(this.page!);
    console.log('Navigating to Non-Functional Testing dashboard...');
    await dashboard.openNonFunctionalTesting();
});

When('I select the non-functional category {string}', async function (this: CustomWorld, category: string) {
    const dashboard = new VisualizationDashboardPage(this.page!);
    console.log(`Selecting non-functional category: ${category}`);
    await dashboard.selectNonFunctionalCategory(category);
});

Then('I should see the following non-functional KPIs:', async function (this: CustomWorld, dataTable: any) {
    const dashboard = new VisualizationDashboardPage(this.page!);
    const kpis: string[] = dataTable.raw().flat().slice(1);
    console.log('Verifying non-functional KPIs:', kpis);
    await dashboard.verifyNonFunctionalKPIs(kpis);
});

Then('the Download Report button should be visible', async function (this: CustomWorld) {
    const dashboard = new VisualizationDashboardPage(this.page!);
    console.log('Verifying Download Report button is visible...');
    await dashboard.verifyDownloadReportButtonVisible();
});

Then('the Share Link button should be visible', async function (this: CustomWorld) {
    const dashboard = new VisualizationDashboardPage(this.page!);
    console.log('Verifying Share Link button is visible...');
    await dashboard.verifyShareLinkButtonVisible();
});

When('I navigate to LLM Configuration via Settings', async function (this: CustomWorld) {
    const dashboard = new VisualizationDashboardPage(this.page!);
    console.log('Navigating to LLM Configuration...');
    await dashboard.openLLMConfiguration();
});

Then('the LLM Configuration table should have the following columns:', async function (this: CustomWorld, dataTable: any) {
    const dashboard = new VisualizationDashboardPage(this.page!);
    const columns: string[] = dataTable.raw().flat().slice(1);
    console.log('Verifying LLM Configuration columns:', columns);
    await dashboard.verifyLLMConfigurationColumns(columns);
});

Then('the Edit and Delete action buttons should be visible', async function (this: CustomWorld) {
    const dashboard = new VisualizationDashboardPage(this.page!);
    console.log('Verifying Edit and Delete buttons...');
    await dashboard.verifyEditDeleteButtonsVisible();
});

When('I navigate to Project Management via Settings', async function (this: CustomWorld) {
    const dashboard = new VisualizationDashboardPage(this.page!);
    console.log('Navigating to Project Management...');
    await dashboard.openProjectManagement();
});

Then('the Project Management page should contain the following sections:', async function (this: CustomWorld, dataTable: any) {
    const dashboard = new VisualizationDashboardPage(this.page!);
    const sections: string[] = dataTable.raw().flat().slice(1);
    console.log('Verifying Project Management sections:', sections);
    await dashboard.verifyProjectManagementSections(sections);
});

Then('I should see the following dashboard overview metrics:', async function (this: CustomWorld, dataTable: any) {
    const dashboard = new VisualizationDashboardPage(this.page!);
    const metrics: string[] = dataTable.raw().flat().slice(1);
    console.log('Verifying dashboard overview metrics:', metrics);
    await dashboard.verifyDashboardOverviewMetrics(metrics);
});

Then('the build filter dropdowns should be visible', async function (this: CustomWorld) {
    const dashboard = new VisualizationDashboardPage(this.page!);
    await dashboard.verifyBuildFilterDropdownsVisible();
});

Then('the builds filter should contain the following options:', async function (this: CustomWorld, dataTable: any) {
    const dashboard = new VisualizationDashboardPage(this.page!);
    const options: string[] = dataTable.raw().flat().slice(1);
    console.log('Verifying builds filter options:', options);
    await dashboard.verifyBuildsFilterOptions(options);
});

Then('the Non-Functional AI Summary panel should display the following sections:', async function (this: CustomWorld, dataTable: any) {
    const dashboard = new VisualizationDashboardPage(this.page!);
    const sections: string[] = dataTable.raw().flat().slice(1);
    console.log('Verifying Non-Functional AI Summary sections:', sections);
    await dashboard.verifyNonFunctionalAISummarySections(sections);
});

Then('the Non-Functional Testing filter labels should be visible:', async function (this: CustomWorld, dataTable: any) {
    const dashboard = new VisualizationDashboardPage(this.page!);
    const labels: string[] = dataTable.raw().flat().slice(1);
    console.log('Verifying Non-Functional filter labels:', labels);
    await dashboard.verifyNonFunctionalFilterLabels(labels);
});

Then('the test suite dropdown filter should be visible', async function (this: CustomWorld) {
    const dashboard = new VisualizationDashboardPage(this.page!);
    console.log('Verifying test suite dropdown is visible...');
    await dashboard.verifyTestSuiteDropdownVisible();
});

Then('the filter placeholder {string} should be visible', async function (this: CustomWorld, placeholder: string) {
    const dashboard = new VisualizationDashboardPage(this.page!);
    console.log(`Verifying filter placeholder: ${placeholder}`);
    await dashboard.verifyFilterPlaceholderVisible(placeholder);
});

Then('the following KPI tooltip descriptions should be visible on the dashboard:', async function (this: CustomWorld, dataTable: any) {
    const dashboard = new VisualizationDashboardPage(this.page!);
    const tooltips: string[] = dataTable.raw().flat().slice(1);
    console.log('Verifying KPI tooltip descriptions:', tooltips);
    await dashboard.verifyKPITooltipDescriptions(tooltips);
});

When('I click the functional testing project info icon', async function (this: CustomWorld) {
    const dashboard = new VisualizationDashboardPage(this.page!);
    console.log('Clicking functional testing project info icon...');
    await dashboard.clickFunctionalTestingInfoIcon();
});

Then('the project info tooltip should contain {string}', async function (this: CustomWorld, text: string) {
    const dashboard = new VisualizationDashboardPage(this.page!);
    console.log(`Verifying project info tooltip contains: ${text}`);
    await dashboard.verifyProjectInfoTooltipText(text);
});

Then('the non-functional testing project info icon should be visible', async function (this: CustomWorld) {
    const dashboard = new VisualizationDashboardPage(this.page!);
    console.log('Verifying non-functional testing project info icon is visible...');
    await dashboard.verifyNonFunctionalInfoIconVisible();
});
