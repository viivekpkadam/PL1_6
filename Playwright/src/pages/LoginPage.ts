import { Locator, Page } from "@playwright/test";
const data = JSON.parse(JSON.stringify(require('../Data/login.json')));




export class LoginPage {
  readonly page: Page;
  private usernameInput: Locator;
  private passwordInput: Locator;
  private loginButton: Locator;
  private loginErrorMessage: Locator;
  private adminButton: Locator;
  private logOut: Locator;
  private getButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator("[placeholder = 'Username']");
    this.passwordInput = page.locator("[placeholder='Password']");
    this.loginButton = page.locator("button.oxd-button");
    this.loginErrorMessage = page.locator(``);
    this.adminButton = page.locator('//li[@class="oxd-userdropdown"]');
    this.logOut = page.locator("//ul[@class='oxd-dropdown-menu']/li[4]");
    this.getButton = page.locator("//div[@class='oxd-topbar-body-nav-slot']/button");
  }
  async performLogin() {
    await this.usernameInput.fill(data.ValidLogin.ValidUserName);
    await this.passwordInput.fill(data.ValidLogin.ValidPassword);
    await this.loginButton.click();
 
  }

  async performLogOut(): Promise<string> {
    await this.adminButton.click();
    await this.logOut.click();
   const Url =  await this.page.waitForURL('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
   return this.page.url();
}


/**
 * Clicks the 'Get Help' button and returns the URL of the newly opened page.
 */
async getUrl(){
  const [newPage] = await Promise.all([
    this.page.context().waitForEvent('page'), // Wait for new tab
    this.getButton.click(),                   // Trigger click on help button
  ]);
}

}
module.exports = { LoginPage };
