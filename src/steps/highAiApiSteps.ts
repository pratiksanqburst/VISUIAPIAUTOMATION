import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import * as dotenv from 'dotenv';
import { HighAIApi } from '../api/high_ai/HighAIApi';

dotenv.config();

let highAIApi: HighAIApi;
let response: any;
let responseBody: any;

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

Given('I have a valid High AI API session', async function () {
    highAIApi = new HighAIApi();
});

When('I send a GET request to the High AI projects endpoint', async function () {
    response = await highAIApi.getProjects();
    responseBody = await response.json();

    console.log('\n========== HIGH AI PROJECTS API RESPONSE ==========');
    console.log(`Status : ${response.status()}`);
    console.log(`Total  : ${responseBody.total}`);
    console.log('Projects:');
    responseBody.projects?.forEach((project: any, index: number) => {
        console.log(`\n  [${index + 1}] ${project.projectName}`);
        console.log(`      id           : ${project.id}`);
        console.log(`      projectKey   : ${project.projectKey}`);
        console.log(`      source       : ${project.source}`);
        console.log(`      isConfigured : ${project.isConfigured}`);
        console.log(`      isDeleted    : ${project.isDeleted}`);
        console.log(`      createdAt    : ${project.createdAt}`);
        console.log(`      updatedAt    : ${project.updatedAt}`);
    });
    console.log('====================================================\n');
});

Then('the High AI API response status should be {int}', async function (statusCode: number) {
    expect([statusCode, 304]).to.include(response.status());
});

Then('the response should contain a {string} array', async function (field: string) {
    expect(responseBody).to.have.property(field);
    expect(Array.isArray(responseBody[field])).to.be.true;
    console.log(`"${field}" array has ${responseBody[field].length} items`);
});

Then('the response should contain a {string} count', async function (field: string) {
    expect(responseBody).to.have.property(field);
    expect(typeof responseBody[field]).to.equal('number');
    console.log(`"${field}" value: ${responseBody[field]}`);
});

Then('the {string} count should match the number of projects in the array', async function (field: string) {
    const total: number = responseBody[field];
    const count: number = responseBody.projects.length;
    console.log(`Total field: ${total}, Actual array length: ${count}`);
    expect(total).to.equal(count);
});

Then('each project in the response should have the following fields:', async function (dataTable: any) {
    const requiredFields: string[] = dataTable.raw().flat().slice(1);
    const projects: any[] = responseBody.projects;
    expect(projects.length).to.be.greaterThan(0);

    projects.forEach((project: any, index: number) => {
        requiredFields.forEach((field: string) => {
            expect(project, `Project at index ${index} missing field "${field}"`).to.have.property(field);
            expect(project[field], `Project at index ${index} field "${field}" should not be null`).to.not.be.null;
        });
    });
    console.log(`Validated required fields on ${projects.length} project(s)`);
});

Then('each project source should be either {string} or {string}', async function (source1: string, source2: string) {
    const projects: any[] = responseBody.projects;
    projects.forEach((project: any, index: number) => {
        expect(
            [source1, source2],
            `Project "${project.projectName}" at index ${index} has invalid source: "${project.source}"`
        ).to.include(project.source);
    });
    console.log(`Validated source values on ${projects.length} project(s)`);
});

Then('each project id should be a valid UUID', async function () {
    const projects: any[] = responseBody.projects;
    projects.forEach((project: any, index: number) => {
        expect(
            UUID_REGEX.test(project.id),
            `Project at index ${index} has invalid UUID id: "${project.id}"`
        ).to.be.true;
    });
    console.log(`Validated UUID format on ${projects.length} project id(s)`);
});

Then('each project createdAt and updatedAt should be valid ISO date strings', async function () {
    const projects: any[] = responseBody.projects;
    projects.forEach((project: any, index: number) => {
        expect(
            ISO_DATE_REGEX.test(project.createdAt),
            `Project at index ${index} has invalid createdAt: "${project.createdAt}"`
        ).to.be.true;
        expect(
            ISO_DATE_REGEX.test(project.updatedAt),
            `Project at index ${index} has invalid updatedAt: "${project.updatedAt}"`
        ).to.be.true;
    });
    console.log(`Validated ISO timestamps on ${projects.length} project(s)`);
});

// ─── Profile API Steps ──────────────────────────────────────────────────────

When('I send a GET request to the High AI profile endpoint', async function () {
    response = await highAIApi.getProfile();
    responseBody = await response.json();

    console.log('\n========== HIGH AI PROFILE API RESPONSE ==========');
    console.log(`Status  : ${response.status()}`);
    console.log(`Message : ${responseBody.message}`);
    console.log('User:');
    console.log(`  userId : ${responseBody.user?.userId}`);
    console.log(`  name   : ${responseBody.user?.name}`);
    console.log(`  email  : ${responseBody.user?.email}`);
    console.log(`  orgId  : ${responseBody.user?.orgId}`);
    console.log(`  role   : ${JSON.stringify(responseBody.user?.role)}`);
    console.log('===================================================\n');
});

Then('the profile response message should be {string}', async function (expectedMessage: string) {
    expect(responseBody).to.have.property('message');
    expect(responseBody.message).to.equal(expectedMessage);
});

Then('the profile user object should have the following fields:', async function (dataTable: any) {
    const requiredFields: string[] = dataTable.raw().flat().slice(1);
    expect(responseBody).to.have.property('user');
    requiredFields.forEach((field: string) => {
        expect(responseBody.user, `User object missing field "${field}"`).to.have.property(field);
    });
    console.log(`Validated user fields: ${requiredFields.join(', ')}`);
});

Then('the profile user userId should be a valid UUID', async function () {
    const userId: string = responseBody.user?.userId;
    expect(UUID_REGEX.test(userId), `Invalid UUID for userId: "${userId}"`).to.be.true;
});

Then('the profile user orgId should be a valid UUID', async function () {
    const orgId: string = responseBody.user?.orgId;
    expect(UUID_REGEX.test(orgId), `Invalid UUID for orgId: "${orgId}"`).to.be.true;
});

Then('the profile user role should be a non-empty array', async function () {
    const role: any = responseBody.user?.role;
    expect(Array.isArray(role), 'role should be an array').to.be.true;
    expect(role.length, 'role array should not be empty').to.be.greaterThan(0);
    console.log(`User roles: ${JSON.stringify(role)}`);
});

Then('the profile user email should be a valid email address', async function () {
    const email: string = responseBody.user?.email;
    expect(EMAIL_REGEX.test(email), `Invalid email format: "${email}"`).to.be.true;
    console.log(`User email validated: ${email}`);
});

// ─── LLM Config API Steps ────────────────────────────────────────────────────

const URL_REGEX = /^https?:\/\/.+/;
const MASKED_KEY_REGEX = /^\*{4}.+/;

When('I send a GET request to the High AI LLM config endpoint', async function () {
    response = await highAIApi.getLLMConfig();
    responseBody = await response.json();

    console.log('\n========== HIGH AI LLM CONFIG API RESPONSE ==========');
    console.log(`Status       : ${response.status()}`);
    console.log(`id           : ${responseBody.id}`);
    console.log(`provider     : ${responseBody.provider}`);
    console.log(`baseUrl      : ${responseBody.baseUrl}`);
    console.log(`modelName    : ${responseBody.modelName}`);
    console.log(`apiKeyMasked : ${responseBody.apiKeyMasked}`);
    console.log(`createdAt    : ${responseBody.createdAt}`);
    console.log(`updatedAt    : ${responseBody.updatedAt}`);
    console.log('=====================================================\n');
});

Then('the LLM config response should have the following fields:', async function (dataTable: any) {
    const requiredFields: string[] = dataTable.raw().flat().slice(1);
    requiredFields.forEach((field: string) => {
        expect(responseBody, `LLM config response missing field "${field}"`).to.have.property(field);
        expect(responseBody[field], `LLM config field "${field}" should not be null`).to.not.be.null;
    });
    console.log(`Validated LLM config fields: ${requiredFields.join(', ')}`);
});

Then('the LLM config id should be a valid UUID', async function () {
    const id: string = responseBody.id;
    expect(UUID_REGEX.test(id), `Invalid UUID for LLM config id: "${id}"`).to.be.true;
});

Then('the LLM config baseUrl should be a valid URL', async function () {
    const baseUrl: string = responseBody.baseUrl;
    expect(URL_REGEX.test(baseUrl), `Invalid URL for baseUrl: "${baseUrl}"`).to.be.true;
    console.log(`baseUrl validated: ${baseUrl}`);
});

Then('the LLM config apiKeyMasked should follow the masked format', async function () {
    const apiKeyMasked: string = responseBody.apiKeyMasked;
    expect(MASKED_KEY_REGEX.test(apiKeyMasked), `apiKeyMasked does not appear masked: "${apiKeyMasked}"`).to.be.true;
    console.log(`apiKeyMasked validated: ${apiKeyMasked}`);
});

Then('the LLM config createdAt and updatedAt should be valid ISO date strings', async function () {
    const { createdAt, updatedAt } = responseBody;
    expect(ISO_DATE_REGEX.test(createdAt), `Invalid createdAt: "${createdAt}"`).to.be.true;
    expect(ISO_DATE_REGEX.test(updatedAt), `Invalid updatedAt: "${updatedAt}"`).to.be.true;
    console.log(`Timestamps validated — createdAt: ${createdAt}, updatedAt: ${updatedAt}`);
});

// ─── RBAC Users API Steps ────────────────────────────────────────────────────

When('I send a GET request to the High AI RBAC users endpoint', async function () {
    response = await highAIApi.getRBACUsers();
    responseBody = await response.json();

    const users = responseBody.data?.users ?? [];
    console.log('\n========== HIGH AI RBAC USERS API RESPONSE ==========');
    console.log(`Status     : ${response.status()}`);
    console.log(`Success    : ${responseBody.success}`);
    console.log(`TotalCount : ${responseBody.data?.totalCount}`);
    console.log('Users:');
    users.forEach((user: any, index: number) => {
        console.log(`\n  [${index + 1}] ${user.name}`);
        console.log(`      userId         : ${user.userId}`);
        console.log(`      email          : ${user.email}`);
        console.log(`      globalRole     : ${user.globalRole}`);
        console.log(`      globalRoleName : ${user.globalRoleName}`);
        console.log(`      status         : ${user.status}`);
    });
    console.log('======================================================\n');
});

Then('the RBAC users response success flag should be true', async function () {
    expect(responseBody).to.have.property('success');
    expect(responseBody.success).to.be.true;
});

Then('the RBAC users response should contain a users array', async function () {
    expect(responseBody.data).to.have.property('users');
    expect(Array.isArray(responseBody.data.users)).to.be.true;
    expect(responseBody.data.users.length).to.be.greaterThan(0);
    console.log(`Users array has ${responseBody.data.users.length} item(s)`);
});

Then('the RBAC users response should contain a totalCount field', async function () {
    expect(responseBody.data).to.have.property('totalCount');
    expect(typeof responseBody.data.totalCount).to.equal('number');
    console.log(`totalCount: ${responseBody.data.totalCount}`);
});

Then('the RBAC users totalCount should match the length of the users array', async function () {
    const total: number = responseBody.data.totalCount;
    const count: number = responseBody.data.users.length;
    console.log(`totalCount field: ${total}, actual array length: ${count}`);
    expect(total).to.equal(count);
});

Then('each RBAC user should have the following fields:', async function (dataTable: any) {
    const requiredFields: string[] = dataTable.raw().flat().slice(1);
    const users: any[] = responseBody.data.users;
    users.forEach((user: any, index: number) => {
        requiredFields.forEach((field: string) => {
            expect(user, `User at index ${index} missing field "${field}"`).to.have.property(field);
        });
    });
    console.log(`Validated required fields on ${users.length} user(s)`);
});

Then('each RBAC user globalRole should be either {string} or {string}', async function (role1: string, role2: string) {
    const users: any[] = responseBody.data.users;
    users.forEach((user: any, index: number) => {
        expect(
            [role1, role2],
            `User "${user.email}" at index ${index} has invalid globalRole: "${user.globalRole}"`
        ).to.include(user.globalRole);
    });
    console.log(`Validated globalRole on ${users.length} user(s)`);
});

Then('each RBAC user userId should be a valid UUID', async function () {
    const users: any[] = responseBody.data.users;
    users.forEach((user: any, index: number) => {
        expect(
            UUID_REGEX.test(user.userId),
            `User at index ${index} has invalid UUID: "${user.userId}"`
        ).to.be.true;
    });
    console.log(`Validated UUID format on ${users.length} user(s)`);
});

Then('each RBAC user status should be {string}', async function (expectedStatus: string) {
    const users: any[] = responseBody.data.users;
    users.forEach((user: any, index: number) => {
        expect(
            user.status,
            `User "${user.email}" at index ${index} has unexpected status: "${user.status}"`
        ).to.equal(expectedStatus);
    });
    console.log(`Validated status "${expectedStatus}" on ${users.length} user(s)`);
});

Then('each RBAC user email should be a valid email address', async function () {
    const users: any[] = responseBody.data.users;
    users.forEach((user: any, index: number) => {
        expect(
            EMAIL_REGEX.test(user.email),
            `User at index ${index} has invalid email: "${user.email}"`
        ).to.be.true;
    });
    console.log(`Validated email format on ${users.length} user(s)`);
});

// ─── High AI Login API Steps ──────────────────────────────────────────────────────

const HIGH_AI_LOGIN_EMAIL    = process.env.VIS_EMAIL    || '';
const HIGH_AI_LOGIN_PASSWORD = process.env.VIS_PASSWORD || '';
const JWT_REGEX = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;

let loginBody: any;

When('I send a POST request to the High AI login endpoint', async function () {
    const loginResponse = await highAIApi.login(HIGH_AI_LOGIN_EMAIL, HIGH_AI_LOGIN_PASSWORD);
    loginBody = await loginResponse.json();
    response = loginResponse;

    const user = loginBody.data?.user ?? {};
    const orgs: any[] = loginBody.data?.organizations ?? [];
    console.log('\n========== HIGH AI LOGIN API RESPONSE ==========');
    console.log(`Status         : ${loginResponse.status()}`);
    console.log(`Success        : ${loginBody.success}`);
    console.log(`Token (prefix) : ${String(loginBody.data?.token).substring(0, 40)}...`);
    console.log(`User userId    : ${user.userId}`);
    console.log(`User email     : ${user.email}`);
    console.log(`User name      : ${user.name}`);
    console.log(`User status    : ${user.status}`);
    console.log(`Organizations  : ${orgs.length}`);
    orgs.forEach((org: any, i: number) => {
        console.log(`  [${i + 1}] ${org.orgName} (${org.orgCode}) — ${org.orgStatus}`);
        console.log(`       platforms: ${Object.keys(org.platforms ?? {}).join(', ')}`);
    });
    console.log('================================================\n');
});

Then('the High AI login response status should be 201', async function () {
    expect(response.status()).to.equal(201);
});

Then('the High AI login response success flag should be true', async function () {
    expect(loginBody).to.have.property('success');
    expect(loginBody.success).to.be.true;
});

Then('the High AI login response should contain a valid JWT token', async function () {
    const token: string = loginBody.data?.token;
    expect(token, 'Token is missing').to.be.a('string').and.not.empty;
    expect(JWT_REGEX.test(token), `Invalid JWT format: "${token.substring(0, 40)}..."`).to.be.true;
    console.log(`JWT token validated (length: ${token.length})`);
});

Then('the High AI login user object should have the following fields:', async function (dataTable: any) {
    const requiredFields: string[] = dataTable.raw().flat().slice(1);
    const user = loginBody.data?.user;
    expect(user, 'User object is missing in response').to.exist;
    requiredFields.forEach((field: string) => {
        expect(user, `Missing field "${field}" in user object`).to.have.property(field);
    });
    console.log(`Validated required fields on user: ${requiredFields.join(', ')}`);
});

Then('the High AI login user userId should be a valid UUID', async function () {
    const userId: string = loginBody.data?.user?.userId;
    expect(UUID_REGEX.test(userId), `Invalid UUID: "${userId}"`).to.be.true;
    console.log(`user.userId validated: ${userId}`);
});

Then('the High AI login user email should be a valid email address', async function () {
    const email: string = loginBody.data?.user?.email;
    expect(EMAIL_REGEX.test(email), `Invalid email: "${email}"`).to.be.true;
    console.log(`user.email validated: ${email}`);
});

Then('the High AI login user status should be {string}', async function (expectedStatus: string) {
    const status: string = loginBody.data?.user?.status;
    expect(status).to.equal(expectedStatus);
    console.log(`user.status validated: ${status}`);
});

Then('the High AI login response should contain a non-empty organizations array', async function () {
    const orgs: any[] = loginBody.data?.organizations;
    expect(Array.isArray(orgs), 'organizations is not an array').to.be.true;
    expect(orgs.length, 'organizations array is empty').to.be.greaterThan(0);
    console.log(`organizations array has ${orgs.length} item(s)`);
});

Then('each High AI login organization should have the following fields:', async function (dataTable: any) {
    const requiredFields: string[] = dataTable.raw().flat().slice(1);
    const orgs: any[] = loginBody.data?.organizations;
    orgs.forEach((org: any, index: number) => {
        requiredFields.forEach((field: string) => {
            expect(org, `Org at index ${index} missing field "${field}"`).to.have.property(field);
        });
    });
    console.log(`Validated required fields on ${orgs.length} organization(s)`);
});

Then('each High AI login organization orgId should be a valid UUID', async function () {
    const orgs: any[] = loginBody.data?.organizations;
    orgs.forEach((org: any, index: number) => {
        expect(
            UUID_REGEX.test(org.orgId),
            `Org at index ${index} has invalid orgId: "${org.orgId}"`
        ).to.be.true;
    });
    console.log(`Validated UUID format on ${orgs.length} organization(s)`);
});

Then('each High AI login organization orgStatus should be {string}', async function (expectedStatus: string) {
    const orgs: any[] = loginBody.data?.organizations;
    orgs.forEach((org: any, index: number) => {
        expect(
            org.orgStatus,
            `Org "${org.orgName}" at index ${index} has unexpected orgStatus: "${org.orgStatus}"`
        ).to.equal(expectedStatus);
    });
    console.log(`Validated orgStatus "${expectedStatus}" on ${orgs.length} organization(s)`);
});

Then('each High AI login organization platforms should contain {string}, {string} and {string} keys', async function (p1: string, p2: string, p3: string) {
    const orgs: any[] = loginBody.data?.organizations;
    orgs.forEach((org: any, index: number) => {
        expect(org.platforms, `Org at index ${index} missing platforms`).to.exist;
        [p1, p2, p3].forEach((key: string) => {
            expect(
                org.platforms,
                `Org "${org.orgName}" at index ${index} missing platform key "${key}"`
            ).to.have.property(key);
        });
    });
    console.log(`Validated platform keys [${p1}, ${p2}, ${p3}] on ${orgs.length} organization(s)`);
});
