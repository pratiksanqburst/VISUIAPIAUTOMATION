import { APIClient } from '../utils/apiClient';

export class SuperAdminApi {
    private apiClient: APIClient;

    constructor() {
        this.apiClient = new APIClient();
    }

    async getOrganizations() {
        return await this.apiClient.get('/admin/orgs');
    }

    async getUsers() {
        return await this.apiClient.get('/admin/users');
    }

    async getRoles() {
        return await this.apiClient.get('/admin/roles');
    }
}
