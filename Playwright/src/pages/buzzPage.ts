import { Page, Locator, expect } from "@playwright/test";
import path from 'path';
const filePath = path.resolve(__dirname, '../../TestImage.jpg');
const commentText = "this is test comment";
const editPostText = "this is edit post comment";


export default class buzzPage {
  readonly page: Page;
  private buzzLink: Locator; 
  private firstPostFooter: Locator;
  private deleteToggle : Locator;
  private deleteButton: Locator;
  private verifyCmnt: Locator;
  private deleteConfirmation: Locator ;
  constructor(page: Page) {
    this.page = page;
    this.buzzLink = page.locator('span.oxd-main-menu-item--name', { hasText: 'Buzz' });
    this.deleteToggle = page.locator("(//button[@type='button'])[9]");
    this.deleteButton = page.locator("//li[@class='orangehrm-buzz-post-header-config-item'][1]");
    this.firstPostFooter = page.locator('div.orangehrm-buzz-post-footer').first();
    this.deleteConfirmation = page.locator("//div[@class='orangehrm-modal-footer']/button[2]");
    this.verifyCmnt = this.page.locator("//p[@class='oxd-text oxd-text--p oxd-text--toast-message oxd-toast-content-text']"); 
  }


/**
 * Deletes the first post on the Buzz page and returns the confirmation message.
 */
public async delete() {
  await this.buzzLink.click();
  await this.deleteToggle.click();
  await this.deleteButton.click();
  await this.deleteConfirmation.click();
  await this.page.waitForTimeout(2000);


}

}