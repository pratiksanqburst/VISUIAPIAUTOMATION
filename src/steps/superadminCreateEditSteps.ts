import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { CustomWorld } from '../hooks/world';
import { UsersPage } from '../pages/UsersPage';

// Store generated test user details for verification across steps
let generatedEmail: string;
let generatedName: string;

function uniqueSuffix() {
    return Date.now().toString().slice(-6);
}

When('I create a new user with prefix {string} and role {string} in org {string}', async function (this: CustomWorld, prefix: string, role: string, org: string) {
    // Create a unique email and name
    const suffix = uniqueSuffix();
    generatedEmail = `${prefix}${suffix}@gmail.com`;
    generatedName = `RandomUser${suffix}`;

    const usersPage = new UsersPage(this.page!);

    // Open create user modal
    await usersPage.clickCreateUser();

    // Fill details and select org/role
    await usersPage.fillUserDetails({ email: generatedEmail, name: generatedName });
    await usersPage.selectOrganizationAndRole(org, role);

    // Submit creation
    await usersPage.clickCreate();
});

Then('I should see the new user in the list', async function (this: CustomWorld) {
    const usersPage = new UsersPage(this.page!);
    await usersPage.searchUser(generatedEmail);
    const visible = await usersPage.isUserVisible(generatedEmail);
    expect(visible, `Expected created user ${generatedEmail} to be visible`).to.be.true;
});

When('I edit that user\'s name to {string}', async function (this: CustomWorld, newName: string) {
    const usersPage = new UsersPage(this.page!);

    // Search and open edit modal
    await usersPage.searchUser(generatedEmail);
    await usersPage.openEditForUser(generatedEmail);

    // Update name and save
    await usersPage.updateUserName(newName);
    await usersPage.saveEdit();

    // Update our in-memory value
    generatedName = newName;
});

Then('I should see the user\'s name updated to {string}', async function (this: CustomWorld, expectedName: string) {
    const usersPage = new UsersPage(this.page!);
    await usersPage.searchUser(generatedEmail);
    const found = await usersPage.isUserNameVisible(generatedEmail, expectedName);
    expect(found, `Expected user ${generatedEmail} to show name ${expectedName}`).to.be.true;
});
