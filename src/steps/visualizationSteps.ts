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

Then('I should see Accessibility, Client Side Performance, Link Validation, Search Engine Optimization and Visual Regression listed', async function (this: CustomWorld) {
    const dashboard = new VisualizationDashboardPage(this.page!);

    expect(await dashboard.rootContains('Accessibility')).to.be.true;
    expect(await dashboard.rootContains('Client Side Performance')).to.be.true;
    expect(await dashboard.rootContains('Link Validation')).to.be.true;
    expect(await dashboard.rootContains('Search Engine Optimization')).to.be.true;
    expect(await dashboard.rootContains('Visual Regression')).to.be.true;
});
