import { request, APIRequestContext } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export class APIClient {
    private requestContext: APIRequestContext | null = null;
    private readonly STORAGE_STATE_PATH = path.join(process.cwd(), 'storageState.json');

    async getRequestContext(): Promise<APIRequestContext> {
        if (!this.requestContext) {
            let options = {};
            if (fs.existsSync(this.STORAGE_STATE_PATH)) {
                const storageState = JSON.parse(fs.readFileSync(this.STORAGE_STATE_PATH, 'utf-8'));
                const token = storageState.origins[0]?.localStorage?.find((item: any) => item.name === 'superAdmin_accessToken')?.value;
                
                options = {
                    extraHTTPHeaders: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                };
            }
            this.requestContext = await request.newContext({
                baseURL: 'https://api.dev.global-portal.qburst.build',
                storageState: fs.existsSync(this.STORAGE_STATE_PATH) ? this.STORAGE_STATE_PATH : undefined,
                ...options
            });
        }
        return this.requestContext;
    }

    async get(endpoint: string) {
        const context = await this.getRequestContext();
        return await context.get(endpoint);
    }
}
