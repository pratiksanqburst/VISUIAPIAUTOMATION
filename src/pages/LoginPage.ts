import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
    private GOOGLE_LOGIN_BUTTON = 'button:has-text("Sign in with Google")';

    async clickGoogleLogin() {
        await this.page.click(this.GOOGLE_LOGIN_BUTTON);
    }
}
