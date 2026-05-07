import { performGoogleLogin } from './auth.setup';

import * as dotenv from 'dotenv';

dotenv.config();

const EMAIL = process.env.GOOGLE_LOGIN_EMAIL as string;
const PASS = process.env.GOOGLE_LOGIN_PASSWORD as string;

if (!EMAIL || !PASS) {
    console.error('Error: GOOGLE_LOGIN_EMAIL and GOOGLE_LOGIN_PASSWORD must be set in .env file.');
    process.exit(1);
}

async function main() {
    console.log('Starting manual Google login...');
    console.log(`Using email: ${EMAIL}`);
    try {
        await performGoogleLogin(EMAIL, PASS);
        console.log('Login successful! storageState.json has been updated.');
    } catch (error) {
        console.error('Login failed during manual execution:', error);
        process.exit(1);
    }
}

main();
