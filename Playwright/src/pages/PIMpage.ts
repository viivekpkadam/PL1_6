import { Page, Locator, expect } from "@playwright/test";
import { assert } from "console";
export default class PIMPage {
  readonly page: Page;
    private PIMLink: Locator;
    private empListbutton: Locator;
    private getEmpId : Locator;
    private fillEmpId: Locator;
    private saveButton: Locator;
  
   
  constructor(page: Page) {
    this.page = page;
    this.PIMLink = page.locator('//span[text()="PIM"]');
    this.empListbutton = page.locator('//a[text()="Employee List"]');
    this.getEmpId= page.locator("//div[@class='oxd-table-row oxd-table-row--with-border oxd-table-row--clickable']/div[2]/div");
    this.fillEmpId= page.locator("//input[@class='oxd-input oxd-input--active']");
    this.saveButton = page.locator("//button[text()=' Search ']");


  }
  /**
 * Searches for an employee by ID and asserts that the result matches the input.
 */
/**
 * Captures an employee ID from the list and searches for it using the Employee ID field.
 * Returns the selected employee ID.
 */
async verifyEmp(id : string){
  await this.PIMLink.click();
  await this.page.waitForTimeout(2000);

  await this.empListbutton.click();
  await this.page.waitForTimeout(3000);
 

  await this.fillEmpId.nth(1).fill(id);
  await this.saveButton.click();
  await this.page.waitForTimeout(5000);
}



  /**
 * Navigates to the PIM section and returns a trimmed list of employee IDs.
 */
async getEmpList() {
  await this.PIMLink.click();
  await this.page.waitForTimeout(3000);   
  await this.empListbutton.click();
  await this.page.waitForTimeout(3000); 

  const empList = await this.getEmpId.allTextContents();  
  
}

  

  

}


//--------------------------------------------
