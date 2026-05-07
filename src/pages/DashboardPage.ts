import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
    private DASHBOARD_HEADER = 'h1:has-text("Dashboard")';
    private WELCOME_MESSAGE = 'text=Welcome, Super Admin';
    

    private SIDEBAR_DASHBOARD = 'nav >> text=Dashboard';
    private SIDEBAR_ORGANIZATIONS = 'nav >> text=Organizations';
    private SIDEBAR_USERS = 'nav >> text=Users';


    private ORG_STAT_CARD = 'text=Active / Total Organizations';
    private USER_STAT_CARD = 'text=Active / Total Users';


    private PROFILE_NAME = 'text="pratik.santhosh@qburst.com"';
    private LOGOUT_BUTTON = 'button:has-text("Logout")';

    async isDashboardVisible() {
        await this.page.waitForSelector(this.DASHBOARD_HEADER);
        return await this.page.isVisible(this.DASHBOARD_HEADER);
    }

    async getWelcomeMessage() {
        return await this.page.textContent(this.WELCOME_MESSAGE);
    }

    async isSidebarOptionVisible(option: string) {
        const selector = option === 'Dashboard' ? this.SIDEBAR_DASHBOARD :
                         option === 'Organizations' ? this.SIDEBAR_ORGANIZATIONS :
                         option === 'Users' ? this.SIDEBAR_USERS : '';
        if (selector) {
            await this.page.waitForSelector(selector, { state: 'visible', timeout: 5000 });
        }
        return await this.page.isVisible(selector);
    }

    async isStatCardVisible(cardName: string) {
        const selector = cardName === 'Organizations' ? this.ORG_STAT_CARD :
                         cardName === 'Users' ? this.USER_STAT_CARD : '';
        return await this.page.isVisible(selector);
    }

    async isLogoutButtonVisible() {
        return await this.page.isVisible(this.LOGOUT_BUTTON);
    }

    async navigateToOrganizations() {
        await this.page.click(this.SIDEBAR_ORGANIZATIONS);
    }

    async navigateToUsers() {
        await this.page.click(this.SIDEBAR_USERS);
    }
}
