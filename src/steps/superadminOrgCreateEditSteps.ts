import { When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { CustomWorld } from '../hooks/world';
import { OrganizationsPage } from '../pages/OrganizationsPage';

// Store generated test organization details for verification across steps
let generatedOrgName: string;
let generatedOrgCode: string;

function uniqueSuffix() {
    return Date.now().toString().slice(-6);
}

When('I create a new organization with code {string} and manual provisioning', async function (this: CustomWorld, codePrefix: string) {
    // Create a unique org name and code
    const suffix = uniqueSuffix();
    generatedOrgName = `TestOrg${suffix}`;
    generatedOrgCode = `${codePrefix}${suffix}`;

    const orgPage = new OrganizationsPage(this.page!);

    // Open create organization modal
    await orgPage.clickCreateOrganization();

    // Fill organization details (skip provisioning mode - keep as is)
    await orgPage.fillOrgInfo({
        name: generatedOrgName,
        code: generatedOrgCode,
        description: 'Automated test organization for edit scenario',
        platforms: ['VIS', 'NFT']
    });

    // Go to next step
    await orgPage.clickNext();

    // Configure feature flags
    await orgPage.configureFeatureFlags({
        nftThreads: '2',
        nftRunOption: 'within',
        ftThreads: '2',
        ftNlp: false
    });

    // Submit creation
    await orgPage.clickFinalCreate();
});

Then('I should see the created organization in the list', async function (this: CustomWorld) {
    const orgPage = new OrganizationsPage(this.page!);
    await orgPage.searchOrganization(generatedOrgName);
    const visible = await orgPage.isOrganizationVisible(generatedOrgName);
    expect(visible, `Expected created organization ${generatedOrgName} to be visible`).to.be.true;
});

When('I edit that organization name to {string}', async function (this: CustomWorld, newName: string) {
    const orgPage = new OrganizationsPage(this.page!);

    // Search and open edit modal
    await orgPage.searchOrganization(generatedOrgName);
    await orgPage.openEditForOrganization(generatedOrgName);

    // Update name (step 1)
    await orgPage.updateOrganizationName(newName);

    // Click Next to go to step 2 (Feature Flags)
    await orgPage.clickNextInEditModal();

    // Save changes (step 2)
    await orgPage.saveOrganizationEdit();

    // Update our in-memory value for verification
    generatedOrgName = newName;
});

Then('I should see the organization name updated to {string}', async function (this: CustomWorld, expectedName: string) {
    const orgPage = new OrganizationsPage(this.page!);
    await orgPage.searchOrganization(expectedName);
    const found = await orgPage.isOrganizationNameVisible(generatedOrgName, expectedName);
    expect(found, `Expected organization to show name ${expectedName}`).to.be.true;
});
