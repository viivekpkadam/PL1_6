import { Page, Locator, expect } from "@playwright/test";
import path from 'path';
const filePath = path.resolve(__dirname, '../../CompanyLogo.png');
export default class AdminPage {
  readonly page: Page;
  private localizationBtn :Locator;
  private langDropdown : Locator;
  private logoMsg :Locator;
  private logoInput : Locator ; 
  private ColorAttribute :Locator;
  private colorInput : Locator;
  private publishBtn : Locator;
  private AdminLink: Locator;
  private crpTab : Locator;
  private primaryColorBtn  : Locator;
  private configTab : Locator;
  private option : Locator;
  private langSaveBtn : Locator;
  private optionEng : Locator;



  constructor(page: Page) {
    this.page = page;
    this.langSaveBtn = this.page.locator("//button[text()=' Save ' or text()=' 儲存 ']")
   this.option = this.page.locator("//div[@role='listbox']//span[contains(normalize-space(), 'Chinese (Traditional')]")
   this.optionEng = this.page.locator("//div[@role='listbox']//span[contains(normalize-space(), 'English (United States')]")
    this.langDropdown= this.page.locator("//div[@class='oxd-select-text oxd-select-text--active']");
    this.localizationBtn= this.page.locator("//a[text()='Localization']");
    this.logoMsg= this.page.locator("span.oxd-text.oxd-text--span.oxd-input-field-error-message.oxd-input-group__message");
    this.logoInput= this.page.locator("//input[@type='file']");
    this.publishBtn= this.page.locator("//button[text()=' Publish ']");
    this.ColorAttribute= this.page.locator("//div[@class='oxd-color-input-preview']");
    this.primaryColorBtn = this.page.locator("//div[@class='oxd-color-input oxd-color-input--active' ]");
    this.crpTab= page.locator("//a[text()='Corporate Branding']");
    this.configTab= page.locator("//span[text()='Configuration ']");
    this.colorInput= this.page.locator("//input[@class='oxd-input oxd-input--active']");
    this.AdminLink = page.locator('text=Admin');   
    
  }
  
  /**
 * Updates the primary corporate branding color and returns the style attribute for validation.
 */
async primaryColor(){
  await this.AdminLink.nth(0).click();
  await this.page.waitForTimeout(2000);
  await this.crpTab.click();
  await this.primaryColorBtn.nth(0).click();

  await this.colorInput.nth(1).fill("#826137");
  await this.publishBtn.click(); 
}



  /**
 * Uploads a company logo file and returns the error message if size exceeds limit.
 */
async companyLogo() {
  await this.AdminLink.nth(0).click();
  await this.page.waitForTimeout(2000);

  await this.crpTab.click();
  await this.page.waitForTimeout(2000);

  await this.logoInput.nth(0).setInputFiles(filePath); // Upload logo file (>1MB)

}



  /**
 * Changes the UI language to Chinese (Traditional, Taiwan) - 中文（繁體，台灣 and returns the selected language text.
 */
async changeLanguage(){
  await this.AdminLink.nth(0).click();
  await this.page.waitForTimeout(2000);

  await this.configTab.click();
  await this.localizationBtn.click();

  await this.langDropdown.nth(0).click();
  await this.option.nth(0).waitFor({ state: 'visible' });
  await this.option.nth(0).click(); // Select first option (e.g., 中文)

  await this.langSaveBtn.click();
}


}

function generateUniqueUsername(base: string = "TestUser"): string {
  const uniqueSuffix = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
  return `${base}${uniqueSuffix}`;
};
