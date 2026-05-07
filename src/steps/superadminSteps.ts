import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { CustomWorld } from '../hooks/world';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { OrganizationsPage } from '../pages/OrganizationsPage';
import { UsersPage } from '../pages/UsersPage';
import { performGoogleLogin, STORAGE_STATE_PATH } from '../utils/auth.setup';
import * as fs from 'fs';

const DASHBOARD_URL = process.env.BASE_URL || 'https://admin.dev.global-portal.qburst.build/';
const EMAIL = process.env.GOOGLE_LOGIN_EMAIL || 'pratik.santhosh@qburst.com';
const PASS = process.env.GOOGLE_LOGIN_PASSWORD || '123502310Pratik$';

Given('I am authenticated as a Super Admin', { timeout: 120000 }, async function (this: CustomWorld) {
    await this.page?.goto(DASHBOARD_URL);
    
    const isLoginPage = this.page?.url().includes('/login');
    
    if (!fs.existsSync(STORAGE_STATE_PATH) || isLoginPage) {
        console.log('Authentication state missing or expired. Performing login...');
        await performGoogleLogin(EMAIL, PASS);
        
        await this.page?.waitForTimeout(5000);
        await this.page?.goto(DASHBOARD_URL);
        await this.page?.waitForLoadState('networkidle');
    }
});

When('I navigate to the Super Admin Dashboard', { timeout: 30000 }, async function (this: CustomWorld) {
    const dashboardPage = new DashboardPage(this.page!);
    await dashboardPage.navigate(DASHBOARD_URL);
    await this.page?.waitForLoadState('networkidle');
    await this.page?.waitForTimeout(2000);
});

Then('I should see the {string} message', async function (this: CustomWorld, expectedMessage: string) {
    const dashboardPage = new DashboardPage(this.page!);
    const actualMessage = await dashboardPage.getWelcomeMessage();
    expect(actualMessage).to.contain(expectedMessage);
});

Then('I should see the following sidebar options:', async function (this: CustomWorld, dataTable: any) {
    const dashboardPage = new DashboardPage(this.page!);
    await this.page?.waitForLoadState('networkidle');
    await this.page?.waitForTimeout(2000);
    const options = dataTable.raw().flat();
    for (const option of options) {
        const isVisible = await dashboardPage.isSidebarOptionVisible(option);
        expect(isVisible, `Sidebar option "${option}" should be visible`).to.be.true;
    }
});

Then('I should see the {string} and {string} stat cards', async function (this: CustomWorld, card1: string, card2: string) {
    const dashboardPage = new DashboardPage(this.page!);
    expect(await dashboardPage.isStatCardVisible(card1), `${card1} stat card should be visible`).to.be.true;
    expect(await dashboardPage.isStatCardVisible(card2), `${card2} stat card should be visible`).to.be.true;
});

Then('I should see the Logout button', async function (this: CustomWorld) {
    const dashboardPage = new DashboardPage(this.page!);
    expect(await dashboardPage.isLogoutButtonVisible(), 'Logout button should be visible').to.be.true;
});



const generateUnique = (val: string) => {
    if (val.startsWith('[Auto]')) {
        const timestamp = new Date().getTime();
        const base = val.replace('[Auto]', '').trim();
        if (base.includes('@')) {
            // Email suffixing
            const [local, domain] = base.split('@');
            return `${local}+${timestamp}@${domain}`;
        }
        return base + '_' + timestamp;
    }
    return val;
};

// Map to store generated unique names for verification
const contextData: { [key: string]: string } = {};

Given('I navigate to the Organizations page', async function (this: CustomWorld) {
    const dashboardPage = new DashboardPage(this.page!);
    await dashboardPage.navigateToOrganizations();
});

When('I click on the "Create Organization" button', async function (this: CustomWorld) {
    const orgPage = new OrganizationsPage(this.page!);
    await orgPage.clickCreateOrganization();
});

When('I fill in the organization info:', async function (this: CustomWorld, dataTable: any) {
    const orgPage = new OrganizationsPage(this.page!);
    const data = dataTable.rowsHash();
    
    const uniqueName = generateUnique(data['Organization Name']);
    const uniqueCode = generateUnique(data['Organization Code']);
    
    contextData['lastOrgName'] = uniqueName;
    
    await orgPage.fillOrgInfo({
        name: uniqueName,
        code: uniqueCode,
        description: data['Description'],
        provisioningMode: data['Provisioning Mode'],
        platforms: data['Platforms'].split(',').map((p: string) => p.trim())
    });
});

When('I click Next on the organization modal', async function (this: CustomWorld) {
    const orgPage = new OrganizationsPage(this.page!);
    await orgPage.clickNext();
});

When('I configure the feature flags:', async function (this: CustomWorld, dataTable: any) {
    const orgPage = new OrganizationsPage(this.page!);
    const data = dataTable.hashes(); // Assuming rows for different platforms
    
    // For now, let's just use the first row or specific mapping
    const nftRow = data.find((r: any) => r.Platform === 'NFT');
    const ftRow = data.find((r: any) => r.Platform === 'FT');

    await orgPage.configureFeatureFlags({
        nftThreads: nftRow?.Threads || '2',
        nftRunOption: nftRow?.['Run Option'] || 'within',
        ftThreads: ftRow?.Threads || '2',
        ftNlp: ftRow?.NLP === 'true'
    });
});

When('I click {string} to finish', async function (this: CustomWorld, buttonText: string) {
    const orgPage = new OrganizationsPage(this.page!);
    await orgPage.clickFinalCreate();
});

Then('the organization {string} should be visible in the list', async function (this: CustomWorld, orgNamePlaceholder: string) {
    const orgPage = new OrganizationsPage(this.page!);
    const actualName = orgNamePlaceholder.startsWith('[Auto]') ? contextData['lastOrgName'] : orgNamePlaceholder;
    
    await this.page?.waitForTimeout(2000);
    const isVisible = await orgPage.isOrganizationVisible(actualName);
    expect(isVisible, `Organization "${actualName}" should be visible`).to.be.true;
});

Then('the organization {string} or {string} should be visible in the list', async function (this: CustomWorld, orgName1: string, orgName2: string) {
    const orgPage = new OrganizationsPage(this.page!);
    await this.page?.waitForTimeout(2000);
    const isVisible1 = await orgPage.isOrganizationVisible(orgName1);
    const isVisible2 = await orgPage.isOrganizationVisible(orgName2);
    expect(isVisible1 || isVisible2, `Either "${orgName1}" or "${orgName2}" should be visible in the list`).to.be.true;
});



Given('I navigate to the Users page', async function (this: CustomWorld) {
    const dashboardPage = new DashboardPage(this.page!);
    await dashboardPage.navigateToUsers();
});

When('I click on the "Create User" button', async function (this: CustomWorld) {
    const usersPage = new UsersPage(this.page!);
    await usersPage.clickCreateUser();
});

When('I fill in the user details:', async function (this: CustomWorld, dataTable: any) {
    const usersPage = new UsersPage(this.page!);
    const data = dataTable.rowsHash();
    
    const uniqueEmail = generateUnique(data['Email']);
    contextData['lastUserEmail'] = uniqueEmail;
    
    await usersPage.fillUserDetails({
        email: uniqueEmail,
        name: data['Name']
    });
    
    contextData['lastUserRole'] = data['Role'];
});

When('I select a random organization for the user', async function (this: CustomWorld) {
    const usersPage = new UsersPage(this.page!);
    const randomOrg = await usersPage.getRandomOrganization();
    expect(randomOrg, 'Should find at least one organization').to.not.be.null;
    
    await usersPage.selectOrganizationAndRole(randomOrg!, contextData['lastUserRole']);
});

When('I click {string} to finish user creation', async function (this: CustomWorld, buttonText: string) {
    const usersPage = new UsersPage(this.page!);
    await usersPage.clickCreate();
});

Then('the user {string} should be visible in the list', async function (this: CustomWorld, emailPlaceholder: string) {
    const usersPage = new UsersPage(this.page!);
    const actualEmail = emailPlaceholder.startsWith('[Auto]') ? contextData['lastUserEmail'] : emailPlaceholder;
    
    await this.page?.waitForTimeout(2000);
    const isVisible = await usersPage.isUserVisible(actualEmail);
    expect(isVisible, `User "${actualEmail}" should be visible`).to.be.true;
});



When('I suspend the organization {string}', async function (this: CustomWorld, orgNamePlaceholder: string) {
    const orgPage = new OrganizationsPage(this.page!);
    const actualName = orgNamePlaceholder.startsWith('[Auto]') ? contextData['lastOrgName'] : orgNamePlaceholder;
    await orgPage.suspendOrganization(actualName);
});



When('I toggle "Show suspended" organizations to {string}', async function (this: CustomWorld, state: string) {
    const orgPage = new OrganizationsPage(this.page!);
    await orgPage.toggleShowSuspended(state === 'on');
});

Then('the organization {string} should have status {string}', async function (this: CustomWorld, orgNamePlaceholder: string, expectedStatus: string) {
    const orgPage = new OrganizationsPage(this.page!);
    const actualName = orgNamePlaceholder.startsWith('[Auto]') ? contextData['lastOrgName'] : orgNamePlaceholder;
    
    let actualStatus = '';
    const timeout = 10000;
    const start = Date.now();
    
    while (Date.now() - start < timeout) {
        actualStatus = await orgPage.getOrganizationStatus(actualName);
        if (actualStatus.toUpperCase() === expectedStatus.toUpperCase()) {
            return;
        }
        await this.page?.waitForTimeout(500);
    }
    
    expect(actualStatus.toUpperCase()).to.equal(expectedStatus.toUpperCase());
});

When('I deactivate the user {string}', async function (this: CustomWorld, emailPlaceholder: string) {
    const usersPage = new UsersPage(this.page!);
    const actualEmail = emailPlaceholder.startsWith('[Auto]') ? contextData['lastUserEmail'] : emailPlaceholder;
    await usersPage.deactivateUser(actualEmail);
});



When('I toggle "Show disabled users" to {string}', async function (this: CustomWorld, state: string) {
    const usersPage = new UsersPage(this.page!);
    await usersPage.toggleShowDisabled(state === 'on');
});

Then('the user {string} should have status {string}', async function (this: CustomWorld, emailPlaceholder: string, expectedStatus: string) {
    const usersPage = new UsersPage(this.page!);
    const actualEmail = emailPlaceholder.startsWith('[Auto]') ? contextData['lastUserEmail'] : emailPlaceholder;
    
    let actualStatus = '';
    const timeout = 10000;
    const start = Date.now();
    
    while (Date.now() - start < timeout) {
        actualStatus = await usersPage.getUserStatus(actualEmail);
        if (actualStatus.toUpperCase() === expectedStatus.toUpperCase()) {
            return;
        }
        await this.page?.waitForTimeout(500);
    }
    
    expect(actualStatus.toUpperCase()).to.equal(expectedStatus.toUpperCase());
});



When('I search for organization {string}', async function (this: CustomWorld, orgName: string) {
    const orgPage = new OrganizationsPage(this.page!);
    await orgPage.searchOrganization(orgName);
});

When('I search for user {string}', async function (this: CustomWorld, userEmail: string) {
    const usersPage = new UsersPage(this.page!);
    const actualEmail = userEmail === '[EMAIL_ADDRESS]' ? EMAIL : userEmail;
    await usersPage.searchUser(actualEmail);
});



Then('I should see suspended organizations in the list', async function (this: CustomWorld) {
    const orgPage = new OrganizationsPage(this.page!);
    // For simplicity, let's check for any SUSPENDED badge.
    const suspendedBadge = this.page?.locator('tr').filter({ hasText: /SUSPENDED/i }).first();
    const isVisible = await suspendedBadge?.isVisible();
    expect(isVisible, 'At least one suspended organization should be visible').to.be.true;
});

