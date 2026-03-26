import { Page, Locator, expect } from "@playwright/test";
const HolidayName = "National Holiday123"; // Define the holiday name
export default class LeavePage {
  readonly page: Page;
  private assignBtn: Locator;
  private assignLeaveTab : Locator;
  private leave: Locator;
  private leaveAssignMsg : Locator;
  constructor(page: Page) {
    this.page = page;
    this.leaveAssignMsg= page.locator("//span[text()='Required']");
    this.assignBtn= page.locator("//button[text()=' Assign ']");
    this.assignLeaveTab= page.locator("//a[contains(text(),'Assign Leave')]");
    this.leave = page.locator("//li[contains(., 'Leave')]//span").first();
  }


  /**
 * Triggers leave assignment without input and returns the required field error message.
 */
async verifyLeaveField() {
  // Navigate directly to the leave assign page - use relative URL based on current domain
  const baseUrl = this.page.url().split('/index.php')[0];
  await this.page.goto(baseUrl + "/index.php/leave/assignLeave");
  await this.page.waitForTimeout(2000);
  await this.assignBtn.click();
}


  

}
const startDate = new Date("2025-01-01");
const endDate = new Date("2025-12-31");

//--------------------------------------------
function getRandomDate(start: Date, end: Date): string {
  const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  const randomDate = new Date(randomTime);

  // Format to YYYY-MM-DD
  const year = randomDate.getFullYear();
  const month = String(randomDate.getMonth() + 1).padStart(2, '0');
  const day = String(randomDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}