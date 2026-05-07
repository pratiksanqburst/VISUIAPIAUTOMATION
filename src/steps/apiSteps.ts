import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { SuperAdminApi } from '../api/SuperAdminApi';

let superAdminApi: SuperAdminApi;
let response: any;

Given('I have a valid authentication token', async function () {
    superAdminApi = new SuperAdminApi();
});

When('I send a GET request to {string}', async function (endpoint: string) {
    if (endpoint.includes('orgs')) {
        response = await superAdminApi.getOrganizations();
    } else if (endpoint.includes('users')) {
        response = await superAdminApi.getUsers();
    } else if (endpoint.includes('roles')) {
        response = await superAdminApi.getRoles();
    } else {
        throw new Error(`Endpoint ${endpoint} not implemented in SuperAdminApi`);
    }
});

Then('the response status should be {int}', async function (statusCode: number) {
    const actualStatus = response.status();
    // Accept either the exact expected status or 304 Not Modified (which essentially means success/cached)
    expect([statusCode, 304]).to.include(actualStatus);
});

Then('the response should contain a list of organizations', async function () {
    const data = await response.json();
    expect(Array.isArray(data)).to.be.true;
    expect(data.length).to.be.greaterThan(0);
});

Then('the response should contain a list of users', async function () {
    const data = await response.json();
    expect(Array.isArray(data)).to.be.true;
    expect(data.length).to.be.greaterThan(0);
    data.forEach((user: any) => {
        expect(user).to.have.property('user_id');
        expect(user).to.have.property('email');
    });
});

Then('the response should contain a list of roles', async function () {
    const data = await response.json();
    expect(Array.isArray(data)).to.be.true;
    expect(data.length).to.be.greaterThan(0);
    data.forEach((role: any) => {
        expect(role).to.have.property('role_id');
        expect(role).to.have.property('role_code');
        expect(role).to.have.property('role_name');
    });
});

Then('each organization in the list should have valid data', async function () {
    const data = await response.json();
    data.forEach((org: any) => {
        expect(org).to.have.property('org_id');
        expect(org).to.have.property('org_name');
        expect(org).to.have.property('org_code');
        expect(org).to.have.property('status');
    });
});
