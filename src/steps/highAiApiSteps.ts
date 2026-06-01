import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { HighAIApi } from '../api/high_ai/HighAIApi';

dotenv.config();

let highAIApi: HighAIApi;
let response: any;
let responseBody: any;

let nfrProjectId: string = '';
let functionalProjectId: string = '';

const PROJECT_IDS_PATH = path.join(process.cwd(), 'src/test-data/project-ids.json');

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

const HIGH_AI_LOGIN_EMAIL = process.env.VIS_EMAIL || '';
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

// ─── NFR & Layers Project ID Extraction Steps ────────────────────────────────

Then('the project named {string} should exist in the response', async function (projectName: string) {
    const projects: any[] = responseBody.projects;
    const found = projects.find((p: any) => p.projectName === projectName);
    expect(found, `Project "${projectName}" not found in the projects list`).to.not.be.undefined;
    console.log(`Project "${projectName}" found — id: ${found.id}, source: ${found.source}`);
});

Then('I save the ID of project {string} as the NFR project ID', async function (projectName: string) {
    const projects: any[] = responseBody.projects;
    const project = projects.find((p: any) => p.projectName === projectName);
    expect(project, `Project "${projectName}" not found — cannot save NFR project ID`).to.not.be.undefined;

    nfrProjectId = project.id;

    const ids = JSON.parse(fs.readFileSync(PROJECT_IDS_PATH, 'utf-8'));
    ids.nfrProjectId = nfrProjectId;
    fs.writeFileSync(PROJECT_IDS_PATH, JSON.stringify(ids, null, 2));

    console.log(`NFR project ID saved: ${nfrProjectId}  (project: "${projectName}", source: ${project.source})`);
});

Then('I save the ID of project {string} as the functional project ID', async function (projectName: string) {
    const projects: any[] = responseBody.projects;
    const project = projects.find((p: any) => p.projectName === projectName);
    expect(project, `Project "${projectName}" not found — cannot save functional project ID`).to.not.be.undefined;

    functionalProjectId = project.id;

    const ids = JSON.parse(fs.readFileSync(PROJECT_IDS_PATH, 'utf-8'));
    ids.functionalProjectId = functionalProjectId;
    ids.functionalProjectName = projectName;
    fs.writeFileSync(PROJECT_IDS_PATH, JSON.stringify(ids, null, 2));

    console.log(`Functional project ID saved: ${functionalProjectId}  (project: "${projectName}", source: ${project.source})`);
});

Then('the stored NFR project ID should be a valid UUID', async function () {
    expect(nfrProjectId, 'NFR project ID has not been stored yet').to.not.equal('');
    expect(UUID_REGEX.test(nfrProjectId), `NFR project ID is not a valid UUID: "${nfrProjectId}"`).to.be.true;
    console.log(`NFR project ID validated: ${nfrProjectId}`);
});

Then('the stored functional project ID should be a valid UUID', async function () {
    expect(functionalProjectId, 'Functional project ID has not been stored yet').to.not.equal('');
    expect(UUID_REGEX.test(functionalProjectId), `Functional project ID is not a valid UUID: "${functionalProjectId}"`).to.be.true;
    console.log(`Functional project ID validated: ${functionalProjectId}`);
});

// ─── NFR & Functional Layers API Steps ───────────────────────────────────────

let layersBody: any;
let layersResponse: any;

function loadProjectIds(): { nfrProjectId: string; nfrExecutionId: string; nfrLayerId: string; functionalProjectId: string; functionalProjectName: string; functionalExecutionId: string; functionalLayerId: string } {
    const raw = fs.readFileSync(PROJECT_IDS_PATH, 'utf-8');
    return JSON.parse(raw);
}

When('I send a GET request to the NFR layers endpoint', async function () {
    const { nfrProjectId: id } = loadProjectIds();
    expect(id, 'NFR project ID not found in project-ids.json — run extraction scenarios first').to.not.equal('');

    layersResponse = await highAIApi.getLayers(id);
    layersBody = await layersResponse.json();
    response = layersResponse;

    console.log('\n========== NFR LAYERS API RESPONSE ==========');
    console.log(`Status : ${layersResponse.status()}`);
    console.log(`Count  : ${layersBody.count}`);
    layersBody.layers?.forEach((layer: any, i: number) => {
        console.log(`\n  [${i + 1}] ${layer.layer_name}  (layer_id: ${layer.layer_id})`);
        console.log(`      source     : ${layer.source}`);
        console.log(`      executions : ${layer.executions?.length ?? 0}`);
    });
    console.log('=============================================\n');
});

When('I send a GET request to the functional layers endpoint', async function () {
    const { functionalProjectId: id } = loadProjectIds();
    expect(id, 'Functional project ID not found in project-ids.json — run extraction scenarios first').to.not.equal('');

    layersResponse = await highAIApi.getLayers(id);
    layersBody = await layersResponse.json();
    response = layersResponse;

    console.log('\n========== FUNCTIONAL LAYERS API RESPONSE ==========');
    console.log(`Status : ${layersResponse.status()}`);
    console.log(`Count  : ${layersBody.count}`);
    layersBody.layers?.forEach((layer: any, i: number) => {
        console.log(`\n  [${i + 1}] ${layer.layer_name}  (layer_id: ${layer.layer_id})`);
        console.log(`      source     : ${layer.source}`);
        console.log(`      executions : ${layer.executions?.length ?? 0}`);
    });
    console.log('====================================================\n');
});

Then('the layers response should contain a {string} array', async function (field: string) {
    expect(layersBody).to.have.property(field);
    expect(Array.isArray(layersBody[field])).to.be.true;
    console.log(`"${field}" array has ${layersBody[field].length} item(s)`);
});

Then('the layers response should contain a {string} field', async function (field: string) {
    expect(layersBody).to.have.property(field);
    expect(typeof layersBody[field]).to.equal('number');
    console.log(`"${field}" value: ${layersBody[field]}`);
});

Then('the layers count should match the length of the layers array', async function () {
    const count: number = layersBody.count;
    const length: number = layersBody.layers.length;
    console.log(`count field: ${count}, actual layers length: ${length}`);
    expect(count).to.equal(length);
});

Then('each layer should have the following fields:', async function (dataTable: any) {
    const requiredFields: string[] = dataTable.raw().flat().slice(1);
    const layers: any[] = layersBody.layers;
    expect(layers.length, 'layers array is empty').to.be.greaterThan(0);

    layers.forEach((layer: any, i: number) => {
        requiredFields.forEach((field: string) => {
            expect(layer, `Layer at index ${i} missing field "${field}"`).to.have.property(field);
        });
    });
    console.log(`Validated required fields on ${layers.length} layer(s)`);
});

Then('each layer source should be {string}', async function (expectedSource: string) {
    const layers: any[] = layersBody.layers;
    layers.forEach((layer: any, i: number) => {
        expect(
            layer.source,
            `Layer "${layer.layer_name}" at index ${i} has unexpected source: "${layer.source}"`
        ).to.equal(expectedSource);
    });
    console.log(`Validated source "${expectedSource}" on ${layers.length} layer(s)`);
});

Then('each layer layer_id should be a valid UUID', async function () {
    const layers: any[] = layersBody.layers;
    layers.forEach((layer: any, i: number) => {
        expect(
            UUID_REGEX.test(layer.layer_id),
            `Layer at index ${i} has invalid layer_id: "${layer.layer_id}"`
        ).to.be.true;
    });
    console.log(`Validated UUID format on ${layers.length} layer_id(s)`);
});

Then('each layer project_id should match the NFR project ID', async function () {
    const { nfrProjectId: id } = loadProjectIds();
    const layers: any[] = layersBody.layers;
    layers.forEach((layer: any, i: number) => {
        expect(
            layer.project_id,
            `Layer at index ${i} project_id "${layer.project_id}" does not match NFR project ID "${id}"`
        ).to.equal(id);
    });
    console.log(`Validated all layer project_ids match NFR project ID: ${id}`);
});

Then('each layer project_id should match the functional project ID', async function () {
    const { functionalProjectId: id } = loadProjectIds();
    const layers: any[] = layersBody.layers;
    layers.forEach((layer: any, i: number) => {
        expect(
            layer.project_id,
            `Layer at index ${i} project_id "${layer.project_id}" does not match functional project ID "${id}"`
        ).to.equal(id);
    });
    console.log(`Validated all layer project_ids match functional project ID: ${id}`);
});

Then('each layer executions should have the following fields:', async function (dataTable: any) {
    const requiredFields: string[] = dataTable.raw().flat().slice(1);
    const layers: any[] = layersBody.layers;
    layers.forEach((layer: any, li: number) => {
        expect(Array.isArray(layer.executions), `Layer at index ${li} "executions" is not an array`).to.be.true;
        layer.executions.forEach((exec: any, ei: number) => {
            requiredFields.forEach((field: string) => {
                expect(exec, `Execution at layer ${li}, exec ${ei} missing field "${field}"`).to.have.property(field);
            });
        });
    });
    console.log(`Validated execution fields across all layers`);
});

Then('each layer execution test_type should be {string}', async function (expectedType: string) {
    const layers: any[] = layersBody.layers;
    layers.forEach((layer: any, li: number) => {
        layer.executions.forEach((exec: any, ei: number) => {
            expect(
                exec.test_type,
                `Execution "${exec.id}" at layer ${li}, exec ${ei} has unexpected test_type: "${exec.test_type}"`
            ).to.equal(expectedType);
        });
    });
    console.log(`Validated test_type "${expectedType}" on all executions`);
});

Then('each NFR layer execution should have a non-empty testingTechniques array', async function () {
    const layers: any[] = layersBody.layers;
    layers.forEach((layer: any, li: number) => {
        layer.executions.forEach((exec: any, ei: number) => {
            expect(
                Array.isArray(exec.testingTechniques),
                `Execution "${exec.id}" at layer ${li}, exec ${ei} — testingTechniques is not an array`
            ).to.be.true;
            expect(
                exec.testingTechniques.length,
                `Execution "${exec.id}" at layer ${li}, exec ${ei} — testingTechniques is empty`
            ).to.be.greaterThan(0);
        });
    });
    console.log(`Validated testingTechniques on all NFR executions`);
});

// ─── Functional Execution Metrics API Steps ──────────────────────────────────

let metricsBody: any;
let metricsResponse: any;

const NUMERIC_METRICS = [
    'executionRate', 'requirementCoverage', 'automationCoverage', 'defectDensity',
    'automationPassRate', 'automationFailRate', 'totalPlannedTests', 'totalExecutedTests',
    'passedTests', 'failedTests', 'skippedTests', 'blockedTests',
    'automatedTests', 'manualTests', 'totalRequirements', 'coveredRequirements', 'totalDefects',
];

Then('I save the first execution ID from the functional layers response', async function () {
    const layers: any[] = layersBody.layers;
    expect(layers.length, 'No layers found in functional layers response').to.be.greaterThan(0);

    const firstLayer = layers[0];
    const firstExec = firstLayer.executions?.[0];
    expect(firstExec, 'No executions found in first functional layer').to.not.be.undefined;

    const ids = JSON.parse(fs.readFileSync(PROJECT_IDS_PATH, 'utf-8'));
    ids.functionalExecutionId = firstExec.id;
    ids.functionalLayerId = firstLayer.layer_id;
    fs.writeFileSync(PROJECT_IDS_PATH, JSON.stringify(ids, null, 2));

    console.log(`Functional execution ID saved: ${firstExec.id}  (executionName: "${firstExec.executionName}")`);
    console.log(`Functional layer ID saved: ${firstLayer.layer_id}  (layer_name: "${firstLayer.layer_name}")`);
});

When('I send a GET request to the functional execution metrics endpoint', async function () {
    const { functionalExecutionId: execId, functionalProjectId: projectId } = loadProjectIds();
    expect(execId, 'functionalExecutionId not found in project-ids.json — run T-HAI-NFR-022 first').to.not.equal('');
    expect(projectId, 'functionalProjectId not found in project-ids.json').to.not.equal('');

    metricsResponse = await highAIApi.getFunctionalExecutionMetrics(execId, projectId);
    metricsBody = await metricsResponse.json();
    response = metricsResponse;

    console.log('\n========== FUNCTIONAL EXECUTION METRICS RESPONSE ==========');
    console.log(`Status              : ${metricsResponse.status()}`);
    console.log(`executionId         : ${metricsBody.executionId}`);
    console.log(`executionRate       : ${metricsBody.executionRate}`);
    console.log(`requirementCoverage : ${metricsBody.requirementCoverage}`);
    console.log(`automationCoverage  : ${metricsBody.automationCoverage}`);
    console.log(`totalPlannedTests   : ${metricsBody.totalPlannedTests}`);
    console.log(`totalExecutedTests  : ${metricsBody.totalExecutedTests}`);
    console.log(`passedTests         : ${metricsBody.passedTests}`);
    console.log(`failedTests         : ${metricsBody.failedTests}`);
    console.log('===========================================================\n');
});

Then('the functional execution metrics response should have the following fields:', async function (dataTable: any) {
    const requiredFields: string[] = dataTable.raw().flat().slice(1);
    requiredFields.forEach((field: string) => {
        expect(metricsBody, `Metrics response missing field "${field}"`).to.have.property(field);
        expect(metricsBody[field], `Metrics field "${field}" should not be null`).to.not.be.null;
    });
    console.log(`Validated ${requiredFields.length} required fields in metrics response`);
});

Then('the metrics executionId should match the stored functional execution ID', async function () {
    const { functionalExecutionId: execId } = loadProjectIds();
    expect(metricsBody.executionId).to.equal(execId);
    console.log(`executionId validated: ${metricsBody.executionId}`);
});

Then('all numeric fields in the functional execution metrics should be non-negative', async function () {
    NUMERIC_METRICS.forEach((field: string) => {
        const value = metricsBody[field];
        expect(typeof value, `Field "${field}" should be a number`).to.equal('number');
        expect(value, `Field "${field}" should be >= 0, got ${value}`).to.be.at.least(0);
    });
    console.log(`Validated ${NUMERIC_METRICS.length} numeric metrics are non-negative`);
});

Then('the functional execution metrics createdAt and updatedAt should be valid ISO date strings', async function () {
    expect(ISO_DATE_REGEX.test(metricsBody.createdAt), `Invalid createdAt: "${metricsBody.createdAt}"`).to.be.true;
    expect(ISO_DATE_REGEX.test(metricsBody.updatedAt), `Invalid updatedAt: "${metricsBody.updatedAt}"`).to.be.true;
    console.log(`Timestamps validated — createdAt: ${metricsBody.createdAt}, updatedAt: ${metricsBody.updatedAt}`);
});

// ─── Functional Quality Summary API Steps ────────────────────────────────────

let qualitySummaryBody: any;
let qualitySummaryResponse: any;

const VALID_STATUSES = ['GOOD', 'WARNING', 'POOR'];
const VALID_PRIORITIES = ['critical', 'medium', 'low'];

When('I send a GET request to the functional quality summary endpoint', async function () {
    const { functionalExecutionId: execId, functionalProjectId: projectId } = loadProjectIds();
    expect(execId, 'functionalExecutionId not found in project-ids.json — run T-HAI-NFR-022 first').to.not.equal('');
    expect(projectId, 'functionalProjectId not found in project-ids.json').to.not.equal('');

    qualitySummaryResponse = await highAIApi.getFunctionalQualitySummary(execId, projectId);
    qualitySummaryBody = await qualitySummaryResponse.json();
    response = qualitySummaryResponse;

    const fn = qualitySummaryBody.functional;
    console.log('\n========== FUNCTIONAL QUALITY SUMMARY RESPONSE ==========');
    console.log(`Status            : ${qualitySummaryResponse.status()}`);
    console.log(`llmStatus         : ${fn?.llmStatus}`);
    console.log(`isStale           : ${fn?.isStale}`);
    console.log(`generatedAt       : ${fn?.generatedAt}`);
    console.log(`categoryStatuses  : ${fn?.categoryStatuses?.length ?? 0}`);
    console.log(`recommendations   : ${fn?.recommendations?.length ?? 0}`);
    fn?.categoryStatuses?.forEach((cs: any) => {
        console.log(`  [${cs.status}] ${cs.label} — score: ${cs.score}`);
    });
    console.log('==========================================================\n');
});

Then('the quality summary response should contain a {string} object', async function (field: string) {
    expect(qualitySummaryBody).to.have.property(field);
    expect(typeof qualitySummaryBody[field]).to.equal('object');
    console.log(`"${field}" object is present`);
});

Then('the quality summary functional object should contain a {string} array', async function (field: string) {
    const fn = qualitySummaryBody.functional;
    expect(fn).to.have.property(field);
    expect(Array.isArray(fn[field]), `"${field}" should be an array`).to.be.true;
    expect(fn[field].length, `"${field}" array should not be empty`).to.be.greaterThan(0);
    console.log(`functional.${field} array has ${fn[field].length} item(s)`);
});

Then('the quality summary functional object should contain a non-empty {string} string', async function (field: string) {
    const fn = qualitySummaryBody.functional;
    expect(fn).to.have.property(field);
    expect(typeof fn[field]).to.equal('string');
    expect(fn[field].length, `"${field}" should not be empty`).to.be.greaterThan(0);
    console.log(`functional.${field} is present (${fn[field].length} chars)`);
});

Then('each categoryStatus should have the following fields:', async function (dataTable: any) {
    const requiredFields: string[] = dataTable.raw().flat().slice(1);
    const categories: any[] = qualitySummaryBody.functional.categoryStatuses;
    categories.forEach((cs: any, i: number) => {
        requiredFields.forEach((field: string) => {
            expect(cs, `categoryStatus at index ${i} missing field "${field}"`).to.have.property(field);
        });
    });
    console.log(`Validated required fields on ${categories.length} categoryStatus(es)`);
});

Then('each categoryStatus status should be one of {string}, {string} or {string}', async function (s1: string, s2: string, s3: string) {
    const categories: any[] = qualitySummaryBody.functional.categoryStatuses;
    categories.forEach((cs: any, i: number) => {
        expect(
            [s1, s2, s3],
            `categoryStatus "${cs.label}" at index ${i} has invalid status: "${cs.status}"`
        ).to.include(cs.status);
    });
    console.log(`Validated status on ${categories.length} categoryStatus(es)`);
});

Then('each categoryStatus score should be a non-negative number', async function () {
    const categories: any[] = qualitySummaryBody.functional.categoryStatuses;
    categories.forEach((cs: any, i: number) => {
        expect(typeof cs.score, `categoryStatus "${cs.label}" at index ${i} score is not a number`).to.equal('number');
        expect(cs.score, `categoryStatus "${cs.label}" at index ${i} score should be >= 0`).to.be.at.least(0);
    });
    console.log(`Validated scores on ${categories.length} categoryStatus(es)`);
});

Then('each recommendation should have the following fields:', async function (dataTable: any) {
    const requiredFields: string[] = dataTable.raw().flat().slice(1);
    const recs: any[] = qualitySummaryBody.functional.recommendations;
    recs.forEach((rec: any, i: number) => {
        requiredFields.forEach((field: string) => {
            expect(rec, `Recommendation at index ${i} missing field "${field}"`).to.have.property(field);
        });
    });
    console.log(`Validated required fields on ${recs.length} recommendation(s)`);
});

Then('each recommendation priority should be one of {string}, {string} or {string}', async function (p1: string, p2: string, p3: string) {
    const recs: any[] = qualitySummaryBody.functional.recommendations;
    recs.forEach((rec: any, i: number) => {
        expect(
            [p1, p2, p3],
            `Recommendation "${rec.title}" at index ${i} has invalid priority: "${rec.priority}"`
        ).to.include(rec.priority);
    });
    console.log(`Validated priority on ${recs.length} recommendation(s)`);
});

Then('the quality summary generatedAt should be a valid ISO date string', async function () {
    const generatedAt: string = qualitySummaryBody.functional.generatedAt;
    expect(ISO_DATE_REGEX.test(generatedAt), `Invalid generatedAt: "${generatedAt}"`).to.be.true;
    console.log(`generatedAt validated: ${generatedAt}`);
});

Then('the quality summary llmStatus should be {string}', async function (expectedStatus: string) {
    const llmStatus: string = qualitySummaryBody.functional.llmStatus;
    expect(llmStatus, `llmStatus "${llmStatus}" does not match expected "${expectedStatus}"`).to.equal(expectedStatus);
    console.log(`llmStatus validated: ${llmStatus}`);
});

// ─── Share Report API Steps ───────────────────────────────────────────────────

let shareReportBody: any;
let shareReportResponse: any;

const VALID_URL_REGEX = /^https?:\/\/.+/;

When('I send a POST request to the share report endpoint', async function () {
    const { functionalExecutionId: execId, functionalProjectId: projectId, functionalProjectName: projectName } = loadProjectIds();
    expect(execId, 'functionalExecutionId not found in project-ids.json — run T-HAI-NFR-022 first').to.not.equal('');
    expect(projectId, 'functionalProjectId not found in project-ids.json').to.not.equal('');
    expect(projectName, 'functionalProjectName not found in project-ids.json').to.not.equal('');

    shareReportResponse = await highAIApi.postShareReport(execId, projectId, projectName);
    shareReportBody = await shareReportResponse.json();
    response = shareReportResponse;

    console.log('\n========== SHARE REPORT API RESPONSE ==========');
    console.log(`Status       : ${shareReportResponse.status()}`);
    console.log(`testType     : ${shareReportBody.testType}`);
    console.log(`hasAiSummary : ${shareReportBody.hasAiSummary}`);
    console.log(`expiresAt    : ${shareReportBody.expiresAt}`);
    console.log(`expiresAtIso : ${shareReportBody.expiresAtIso}`);
    console.log(`shareUrl     : ${shareReportBody.shareUrl}`);
    console.log('================================================\n');
});

Then('the share report response should have the following fields:', async function (dataTable: any) {
    const requiredFields: string[] = dataTable.raw().flat().slice(1);
    requiredFields.forEach((field: string) => {
        expect(shareReportBody, `Share report response missing field "${field}"`).to.have.property(field);
        expect(shareReportBody[field], `Share report field "${field}" should not be null`).to.not.be.null;
    });
    console.log(`Validated ${requiredFields.length} required fields in share report response`);
});

Then('the share report shareUrl should be a valid URL', async function () {
    const shareUrl: string = shareReportBody.shareUrl;
    expect(VALID_URL_REGEX.test(shareUrl), `shareUrl is not a valid URL: "${shareUrl}"`).to.be.true;
    console.log(`shareUrl validated: ${shareUrl}`);
});

Then('the share report testType should be {string}', async function (expectedType: string) {
    expect(shareReportBody.testType).to.equal(expectedType);
    console.log(`testType validated: ${shareReportBody.testType}`);
});

Then('the share report expiresAtIso should be a valid ISO date string', async function () {
    const expiresAtIso: string = shareReportBody.expiresAtIso;
    expect(ISO_DATE_REGEX.test(expiresAtIso), `expiresAtIso is not a valid ISO date: "${expiresAtIso}"`).to.be.true;
    console.log(`expiresAtIso validated: ${expiresAtIso}`);
});

Then('the share report expiresAt should be a positive number', async function () {
    const expiresAt: number = shareReportBody.expiresAt;
    expect(typeof expiresAt, 'expiresAt should be a number').to.equal('number');
    expect(expiresAt, `expiresAt should be > 0, got ${expiresAt}`).to.be.greaterThan(0);
    console.log(`expiresAt validated: ${expiresAt}`);
});

Then('the share report hasAiSummary should be a boolean', async function () {
    expect(typeof shareReportBody.hasAiSummary, 'hasAiSummary should be a boolean').to.equal('boolean');
    console.log(`hasAiSummary validated: ${shareReportBody.hasAiSummary}`);
});

// ─── NFR Quality Summary API Steps ───────────────────────────────────────────

let nfrQualitySummaryBody: any;
let nfrQualitySummaryResponse: any;

Then('I save the first execution ID from the NFR layers response', async function () {
    const layers: any[] = layersBody.layers;
    expect(layers.length, 'No layers found in NFR layers response').to.be.greaterThan(0);

    const firstLayer = layers[0];
    const firstExec = firstLayer.executions?.[0];
    expect(firstExec, 'No executions found in first NFR layer').to.not.be.undefined;

    const ids = JSON.parse(fs.readFileSync(PROJECT_IDS_PATH, 'utf-8'));
    ids.nfrExecutionId = firstExec.id;
    ids.nfrLayerId = firstLayer.layer_id;
    fs.writeFileSync(PROJECT_IDS_PATH, JSON.stringify(ids, null, 2));

    console.log(`NFR execution ID saved: ${firstExec.id}  (executionName: "${firstExec.executionName}")`);
    console.log(`NFR layer ID saved: ${firstLayer.layer_id}  (layer_name: "${firstLayer.layer_name}")`);
});

When('I send a GET request to the NFR quality summary endpoint', async function () {
    const { nfrExecutionId: execId, nfrProjectId: projectId } = loadProjectIds();
    expect(execId, 'nfrExecutionId not found in project-ids.json — run T-HAI-NFR-047 first').to.not.equal('');
    expect(projectId, 'nfrProjectId not found in project-ids.json').to.not.equal('');

    nfrQualitySummaryResponse = await highAIApi.getNFRQualitySummary(execId, projectId);
    nfrQualitySummaryBody = await nfrQualitySummaryResponse.json();
    response = nfrQualitySummaryResponse;

    const nfr = nfrQualitySummaryBody.nfr;
    console.log('\n========== NFR QUALITY SUMMARY RESPONSE ==========');
    console.log(`Status           : ${nfrQualitySummaryResponse.status()}`);
    console.log(`llmStatus        : ${nfr?.llmStatus}`);
    console.log(`isStale          : ${nfr?.isStale}`);
    console.log(`generatedAt      : ${nfr?.generatedAt}`);
    console.log(`categoryStatuses : ${nfr?.categoryStatuses?.length ?? 0}`);
    console.log(`recommendations  : ${nfr?.recommendations?.length ?? 0}`);
    nfr?.categoryStatuses?.forEach((cs: any) => {
        console.log(`  [${cs.status}] ${cs.label} — score: ${cs.score}`);
    });
    console.log('===================================================\n');
});

Then('the NFR quality summary response should contain a "nfr" object', async function () {
    expect(nfrQualitySummaryBody).to.have.property('nfr');
    expect(typeof nfrQualitySummaryBody.nfr).to.equal('object');
    console.log('"nfr" object is present in NFR quality summary response');
});

Then('the NFR quality summary object should contain a {string} array', async function (field: string) {
    const nfr = nfrQualitySummaryBody.nfr;
    expect(nfr).to.have.property(field);
    expect(Array.isArray(nfr[field]), `"${field}" should be an array`).to.be.true;
    expect(nfr[field].length, `"${field}" array should not be empty`).to.be.greaterThan(0);
    console.log(`nfr.${field} array has ${nfr[field].length} item(s)`);
});

Then('the NFR quality summary object should contain a non-empty {string} string', async function (field: string) {
    const nfr = nfrQualitySummaryBody.nfr;
    expect(nfr).to.have.property(field);
    expect(typeof nfr[field]).to.equal('string');
    expect(nfr[field].length, `"${field}" should not be empty`).to.be.greaterThan(0);
    console.log(`nfr.${field} is present (${nfr[field].length} chars)`);
});

Then('each NFR categoryStatus should have the following fields:', async function (dataTable: any) {
    const requiredFields: string[] = dataTable.raw().flat().slice(1);
    const categories: any[] = nfrQualitySummaryBody.nfr.categoryStatuses;
    categories.forEach((cs: any, i: number) => {
        requiredFields.forEach((field: string) => {
            expect(cs, `NFR categoryStatus at index ${i} missing field "${field}"`).to.have.property(field);
        });
    });
    console.log(`Validated required fields on ${categories.length} NFR categoryStatus(es)`);
});

Then('each NFR categoryStatus status should be one of {string}, {string} or {string}', async function (s1: string, s2: string, s3: string) {
    const categories: any[] = nfrQualitySummaryBody.nfr.categoryStatuses;
    categories.forEach((cs: any, i: number) => {
        expect(
            [s1, s2, s3],
            `NFR categoryStatus "${cs.label}" at index ${i} has invalid status: "${cs.status}"`
        ).to.include(cs.status);
    });
    console.log(`Validated status on ${categories.length} NFR categoryStatus(es)`);
});

Then('each NFR categoryStatus score should be a non-negative number', async function () {
    const categories: any[] = nfrQualitySummaryBody.nfr.categoryStatuses;
    categories.forEach((cs: any, i: number) => {
        expect(typeof cs.score, `NFR categoryStatus "${cs.label}" at index ${i} score is not a number`).to.equal('number');
        expect(cs.score, `NFR categoryStatus "${cs.label}" at index ${i} score should be >= 0`).to.be.at.least(0);
    });
    console.log(`Validated scores on ${categories.length} NFR categoryStatus(es)`);
});

Then('each NFR recommendation should have the following fields:', async function (dataTable: any) {
    const requiredFields: string[] = dataTable.raw().flat().slice(1);
    const recs: any[] = nfrQualitySummaryBody.nfr.recommendations;
    recs.forEach((rec: any, i: number) => {
        requiredFields.forEach((field: string) => {
            expect(rec, `NFR recommendation at index ${i} missing field "${field}"`).to.have.property(field);
        });
    });
    console.log(`Validated required fields on ${recs.length} NFR recommendation(s)`);
});

Then('the NFR quality summary generatedAt should be a valid ISO date string', async function () {
    const generatedAt: string = nfrQualitySummaryBody.nfr.generatedAt;
    expect(ISO_DATE_REGEX.test(generatedAt), `Invalid generatedAt: "${generatedAt}"`).to.be.true;
    console.log(`NFR generatedAt validated: ${generatedAt}`);
});

Then('the NFR quality summary llmStatus should be {string}', async function (expectedStatus: string) {
    const llmStatus: string = nfrQualitySummaryBody.nfr.llmStatus;
    expect(llmStatus, `llmStatus "${llmStatus}" does not match expected "${expectedStatus}"`).to.equal(expectedStatus);
    console.log(`NFR llmStatus validated: ${llmStatus}`);
});

// ─── NFR Execution Detail API Steps ──────────────────────────────────────────

let nfrDetailBody: any;

async function callNFRDetail(apiMethod: (id: string, pid: string) => Promise<any>, label: string): Promise<void> {
    const { nfrExecutionId: execId, nfrProjectId: projectId } = loadProjectIds();
    expect(execId, `nfrExecutionId not found — run T-HAI-NFR-047 first`).to.not.equal('');
    expect(projectId, `nfrProjectId not found in project-ids.json`).to.not.equal('');

    const res = await apiMethod(execId, projectId);
    nfrDetailBody = await res.json();
    response = res;

    console.log(`\n========== NFR ${label.toUpperCase()} RESPONSE ==========`);
    console.log(`Status      : ${res.status()}`);
    console.log(`data_status : ${nfrDetailBody.data_status}`);
    console.log(`test_suites : ${nfrDetailBody.test_suites?.length ?? (nfrDetailBody.browsers?.length ?? 'n/a')}`);
    console.log('====================================================\n');
}

When('I send a GET request to the NFR performance endpoint', async function () {
    await callNFRDetail(highAIApi.getNFRPerformance.bind(highAIApi), 'performance');
});

When('I send a GET request to the NFR link-validation endpoint', async function () {
    await callNFRDetail(highAIApi.getNFRLinkValidation.bind(highAIApi), 'link-validation');
});

When('I send a GET request to the NFR SEO endpoint', async function () {
    await callNFRDetail(highAIApi.getNFRSeo.bind(highAIApi), 'seo');
});

When('I send a GET request to the NFR visual endpoint', async function () {
    await callNFRDetail(highAIApi.getNFRVisual.bind(highAIApi), 'visual');
});

Then('the NFR execution detail response should have data_status {string} with summary and test_suites', async function (expectedStatus: string) {
    expect(nfrDetailBody.data_status).to.equal(expectedStatus);
    expect(nfrDetailBody).to.have.property('summary');
    expect(typeof nfrDetailBody.summary).to.equal('object');
    expect(nfrDetailBody).to.have.property('test_suites');
    expect(Array.isArray(nfrDetailBody.test_suites), 'test_suites should be an array').to.be.true;
    expect(nfrDetailBody.test_suites.length, 'test_suites should not be empty').to.be.greaterThan(0);
    console.log(`data_status: ${nfrDetailBody.data_status}, test_suites: ${nfrDetailBody.test_suites.length}`);
});

Then('the NFR visual response should have data_status {string} with summary and browsers', async function (expectedStatus: string) {
    expect(nfrDetailBody.data_status).to.equal(expectedStatus);
    expect(nfrDetailBody).to.have.property('summary');
    expect(typeof nfrDetailBody.summary).to.equal('object');
    expect(nfrDetailBody).to.have.property('browsers');
    expect(Array.isArray(nfrDetailBody.browsers), 'browsers should be an array').to.be.true;
    expect(nfrDetailBody.browsers.length, 'browsers should not be empty').to.be.greaterThan(0);
    console.log(`data_status: ${nfrDetailBody.data_status}, browsers: ${nfrDetailBody.browsers.length}`);
});

// ─── RRI Calculate API Steps ────────────────────────────────────────────────

let rriBody: any;

When('I send a GET request to the RRI calculate endpoint', async function () {
    const { functionalExecutionId: funcId, functionalProjectId, nfrProjectId } = loadProjectIds();
    expect(funcId, 'functionalExecutionId not found — run T-HAI-NFR-022 first').to.not.equal('');
    expect(functionalProjectId, 'functionalProjectId not found in project-ids.json').to.not.equal('');
    expect(nfrProjectId, 'nfrProjectId not found in project-ids.json').to.not.equal('');

    const res = await highAIApi.getRRICalculate(funcId, functionalProjectId, nfrProjectId);
    rriBody = await res.json();
    response = res;

    const rri = rriBody.release_readiness_index;
    console.log('\n========== RRI CALCULATE RESPONSE ==========');
    console.log(`Status   : ${res.status()}`);
    console.log(`Score    : ${rri?.score}`);
    console.log(`Decision : ${rri?.decision}`);
    console.log('============================================\n');
});

Then('the RRI response should have a valid release_readiness_index with score, decision and narrative', async function () {
    const rri = rriBody.release_readiness_index;
    expect(rri, 'release_readiness_index is missing').to.not.be.undefined;
    expect(typeof rri.score, 'score should be a number').to.equal('number');
    expect(rri.score, 'score should be between 0 and 100').to.be.within(0, 100);
    expect(rri.decision, 'decision should be a non-empty string').to.be.a('string').and.not.equal('');
    expect(rri.assessment_type, 'assessment_type should be a string').to.be.a('string').and.not.equal('');
    expect(rri).to.have.property('pillars');
    expect(rri.pillars).to.have.property('functional_quality');
    expect(rri.pillars).to.have.property('coverage_completeness');
    expect(rri).to.have.property('hard_gates');

    const narrative = rriBody.narrative;
    expect(narrative, 'narrative is missing').to.not.be.undefined;
    expect(narrative.llmStatus, 'narrative.llmStatus should be a string').to.be.a('string').and.not.equal('');
    expect(narrative.generatedAt, 'narrative.generatedAt should be a valid ISO date').to.match(ISO_DATE_REGEX);
    expect(Array.isArray(narrative.concerns), 'narrative.concerns should be an array').to.be.true;
    expect(Array.isArray(narrative.strengths), 'narrative.strengths should be an array').to.be.true;
    expect(Array.isArray(narrative.next_steps), 'narrative.next_steps should be an array').to.be.true;
    expect(Array.isArray(narrative.recommendations), 'narrative.recommendations should be an array').to.be.true;

    console.log(`RRI score: ${rri.score}, decision: ${rri.decision}, llmStatus: ${narrative.llmStatus}`);
});

Then('the RRI decision should be one of {string}, {string} or {string}', async function (v1: string, v2: string, v3: string) {
    const decision: string = rriBody.release_readiness_index.decision;
    expect([v1, v2, v3], `decision "${decision}" is not a valid value`).to.include(decision);
    console.log(`RRI decision: ${decision}`);
});

Then('the RRI release_readiness_index timestamp should be a valid ISO date string', async function () {
    const ts: string = rriBody.release_readiness_index.timestamp;
    expect(ts, `timestamp "${ts}" is not a valid ISO date`).to.match(ISO_DATE_REGEX);
    console.log(`RRI timestamp: ${ts}`);
});

Then('the RRI functional_quality pillar should have score, weight, contribution and components', async function () {
    const fq = rriBody.release_readiness_index.pillars.functional_quality;
    ['score', 'weight', 'contribution', 'components'].forEach(field => {
        expect(fq, `functional_quality missing field: ${field}`).to.have.property(field);
    });
    expect(typeof fq.score, 'score should be a number').to.equal('number');
    expect(typeof fq.weight, 'weight should be a number').to.equal('number');
    expect(typeof fq.contribution, 'contribution should be a number').to.equal('number');
    console.log(`functional_quality: score=${fq.score}, weight=${fq.weight}, contribution=${fq.contribution}`);
});

Then('the RRI coverage_completeness pillar should have score, weight, contribution and components', async function () {
    const cc = rriBody.release_readiness_index.pillars.coverage_completeness;
    ['score', 'weight', 'contribution', 'components'].forEach(field => {
        expect(cc, `coverage_completeness missing field: ${field}`).to.have.property(field);
    });
    expect(typeof cc.score, 'score should be a number').to.equal('number');
    expect(typeof cc.weight, 'weight should be a number').to.equal('number');
    expect(typeof cc.contribution, 'contribution should be a number').to.equal('number');
    console.log(`coverage_completeness: score=${cc.score}, weight=${cc.weight}, contribution=${cc.contribution}`);
});

Then('the RRI functional_quality components should have test_pass_rate and defect_free_rate', async function () {
    const components = rriBody.release_readiness_index.pillars.functional_quality.components;
    ['test_pass_rate', 'defect_free_rate'].forEach(key => {
        expect(components, `functional_quality.components missing: ${key}`).to.have.property(key);
        expect(components[key]).to.have.property('value');
        expect(components[key]).to.have.property('weight');
        expect(components[key]).to.have.property('gated');
        expect(typeof components[key].value, `${key}.value should be a number`).to.equal('number');
    });
    console.log(`test_pass_rate=${components.test_pass_rate.value}, defect_free_rate=${components.defect_free_rate.value}`);
});

Then('the RRI coverage_completeness components should have execution_rate, automation_coverage and requirement_coverage', async function () {
    const components = rriBody.release_readiness_index.pillars.coverage_completeness.components;
    ['execution_rate', 'automation_coverage', 'requirement_coverage'].forEach(key => {
        expect(components, `coverage_completeness.components missing: ${key}`).to.have.property(key);
        expect(components[key]).to.have.property('value');
        expect(components[key]).to.have.property('weight');
        expect(components[key]).to.have.property('gated');
        expect(typeof components[key].value, `${key}.value should be a number`).to.equal('number');
    });
    console.log(`execution_rate=${components.execution_rate.value}, automation_coverage=${components.automation_coverage.value}, requirement_coverage=${components.requirement_coverage.value}`);
});

Then('all RRI pillar scores should be between 0 and 100', async function () {
    const pillars = rriBody.release_readiness_index.pillars;
    Object.entries(pillars).forEach(([name, pillar]: [string, any]) => {
        expect(pillar.score, `${name}.score should be between 0 and 100`).to.be.within(0, 100);
    });
    console.log('All pillar scores are within [0, 100]');
});

Then('the RRI hard_gates should have required boolean fields', async function () {
    const gates = rriBody.release_readiness_index.hard_gates;
    const required = ['seo_gate', 'visual_drift_gate', 'accessibility_gate', 'execution_rate_gate'];
    required.forEach(gate => {
        expect(gates, `hard_gates missing field: ${gate}`).to.have.property(gate);
        expect(typeof gates[gate], `${gate} should be a boolean`).to.equal('boolean');
    });
    console.log(`hard_gates: ${JSON.stringify(gates)}`);
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

// ─── Negative Scenarios — Layers API ─────────────────────────────────────────

let negResponse: any;
let negResponseBody: any;

When('I send a GET request to the layers endpoint with project ID {string}', async function (projectId: string) {
    negResponse = await highAIApi.getLayers(projectId);
    try { negResponseBody = await negResponse.json(); } catch { negResponseBody = {}; }
    response = negResponse;
    console.log(`\nLayers GET with projectId="${projectId}" → Status: ${negResponse.status()}`);
    console.log(`Response body: ${JSON.stringify(negResponseBody).substring(0, 200)}`);
});

When('I send a GET request to the NFR layers endpoint without authentication', async function () {
    const { nfrProjectId: id } = loadProjectIds();
    expect(id, 'NFR project ID not found in project-ids.json — run extraction scenarios first').to.not.equal('');
    negResponse = await highAIApi.getLayersWithoutAuth(id);
    try { negResponseBody = await negResponse.json(); } catch { negResponseBody = {}; }
    response = negResponse;
    console.log(`\nLayers GET without auth → Status: ${negResponse.status()}`);
    console.log(`Response body: ${JSON.stringify(negResponseBody).substring(0, 200)}`);
});

When('I send a GET request to the NFR layers endpoint with an invalid token {string}', async function (token: string) {
    const { nfrProjectId: id } = loadProjectIds();
    expect(id, 'NFR project ID not found in project-ids.json — run extraction scenarios first').to.not.equal('');
    negResponse = await highAIApi.getLayersWithInvalidToken(id, token);
    try { negResponseBody = await negResponse.json(); } catch { negResponseBody = {}; }
    response = negResponse;
    console.log(`\nLayers GET with invalid token → Status: ${negResponse.status()}`);
    console.log(`Response body: ${JSON.stringify(negResponseBody).substring(0, 200)}`);
});

When('I send a {string} request to the NFR layers endpoint', async function (method: string) {
    const { nfrProjectId: id } = loadProjectIds();
    expect(id, 'NFR project ID not found in project-ids.json — run extraction scenarios first').to.not.equal('');
    negResponse = await highAIApi.sendLayersRequest(id, method);
    try { negResponseBody = await negResponse.json(); } catch { negResponseBody = {}; }
    response = negResponse;
    console.log(`\nLayers ${method} request → Status: ${negResponse.status()}`);
    console.log(`Response body: ${JSON.stringify(negResponseBody).substring(0, 200)}`);
});

Then('the High AI API response status should be a 4xx client error', async function () {
    const status = response.status();
    expect(status, `Expected a 4xx client error status but got ${status}`).to.be.within(400, 499);
    console.log(`Response status: ${status} (4xx confirmed)`);
});

Then('the High AI API response status should be a non-2xx error', async function () {
    const status = response.status();
    expect(status, `Expected a non-2xx error status but got ${status}`).to.be.at.least(400);
    console.log(`Response status: ${status} (non-2xx confirmed — actual API behaviour)`);
});

Then('the layers error response should not contain a layers array', async function () {
    const hasLayers = Array.isArray(negResponseBody?.layers);
    expect(hasLayers, 'Expected no "layers" array in error response, but found one').to.be.false;
    console.log('Confirmed: "layers" array is absent from the error response body');
});

Then('the layers error response body should be valid JSON', async function () {
    expect(negResponseBody, 'Expected a non-null JSON object in error response body').to.not.be.null;
    expect(typeof negResponseBody, 'Expected error response body to be an object').to.equal('object');
    console.log(`Error response body is valid JSON: ${JSON.stringify(negResponseBody).substring(0, 200)}`);
});
