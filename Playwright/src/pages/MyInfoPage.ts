import { Locator, Page, expect } from "@playwright/test";
import path from 'path';
const filePath = path.resolve(__dirname, '../../TestImage.jpg');
const Path = path.resolve(__dirname, '../../');
const data = JSON.parse(JSON.stringify(require('../Data/TestData.json')));


export class MyInfoPage {
  readonly page: Page;
  private Myinfo: Locator;
 
  private downloadBtn : Locator;
  private firstName : Locator;
  private midName : Locator;
  private lastName : Locator;
  private saveBtn : Locator;
  public static fileName: any;
  
  constructor(page: Page) {
    this.page = page;
    this.firstName= page.locator("//input[@name='firstName']");
    this.midName = page.locator("//input[@name='middleName']");
    this.lastName = page.locator("//input[@name='lastName']");
    this.saveBtn= page.locator("//button[@type='submit']");
    this.downloadBtn = page.locator("(//i[@class='oxd-icon bi-download'])[1]");
    this.Myinfo = page.locator("text=My Info");
  }
  

/**
 * Downloads the user info file from the My Info tab and returns the filename.
 */
async downloadInfo() {
  await this.Myinfo.click();
  await this.page.waitForTimeout(1500);
  await this.downloadBtn.scrollIntoViewIfNeeded();
//
  const [download] = await Promise.all([
    this.page.waitForEvent('download'),
    this.downloadBtn.click(),
  ]);

  const parentDir = path.resolve(process.cwd(), 'downloadImage');
  MyInfoPage.fileName = download.suggestedFilename();
  const savePath = path.join(parentDir, MyInfoPage.fileName);

  await download.saveAs(savePath);
 }


/**
 * Fills in and saves user details (first, middle, last name) under the My Info tab.
 */
async verifyUser() {
  await this.Myinfo.click();
  await this.page.waitForTimeout(2000);

  await this.firstName.fill(data.VerifyUser.firstName);
  await this.midName.fill(data.VerifyUser.midName);
  await this.lastName.fill(data.VerifyUser.lastName);
  await this.saveBtn.nth(0).click();

  await this.page.waitForTimeout(2000);
  await this.page.reload();
}


   
}
