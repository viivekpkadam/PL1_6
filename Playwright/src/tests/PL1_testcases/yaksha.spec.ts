import {  test } from "playwright/test";
import { Page, Locator, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import  AdminPage  from "src/pages/AdminPage";
import LeavePage from "src/pages/LeavePage";
import { MyInfoPage } from "src/pages/MyInfoPage";
import BuzzPage from "src/pages/buzzPage";
import PIMPage from "src/pages/PIMpage";
import * as fs from 'fs';
import * as path from 'path';
const data = JSON.parse(JSON.stringify(require('../../Data/TestData.json')));



test.describe("Yaksha", () => {
 let loginPage: LoginPage;
 let myinfoPage : MyInfoPage;
 let adminPage : AdminPage ;
 let leavePage: LeavePage;
let buzzPage: BuzzPage;
let PimPage :PIMPage;
 

  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto("");
    loginPage = new LoginPage(page);
    myinfoPage= new MyInfoPage(page); 
    adminPage = new AdminPage(page);
    leavePage = new LeavePage(page);
    buzzPage = new BuzzPage(page);
    PimPage= new PIMPage(page);
    await loginPage.performLogin();
  });

 

 /**
 * Test Case: 1_Verify 'Delete Post' Functionality
 *
 * Objective:
 * Ensure that a user is able to delete a Buzz post successfully and receive a confirmation message.
 *
 * Steps Performed:
 *  1. Navigate to the Buzz page.
 *  2. Click on the delete toggle/menu of the first post.
 *  3. Click the delete button to trigger confirmation.
 *  4. Confirm the deletion in the confirmation dialog.
 *  5. Wait for completion and retrieve the success message.
 *  6. Assert that the confirmation message contains "Successfully Deleted".
 *
 * Expected Result:
 * A success message "Successfully Deleted" should appear after the post is deleted.
 */

test("1_Verify 'Delete Post' Functionality", async ({ page }) => {
  // Step 1–5: Perform deletion and retrieve the confirmation message
  await buzzPage.delete();
  const deleteConfirmText = await page.locator("//p[@class='oxd-text oxd-text--p oxd-text--toast-message oxd-toast-content-text']").first().textContent();
  const actualText = await page.locator("//p[contains(@class, 'toast-message') and text()='Successfully Deleted']").textContent();
  expect(deleteConfirmText).toContain(actualText);
});


  /**
 * Test Case: TS-2 Verify 'Get Help' Button is Functional
 *
 * Objective:
 * Validate that clicking the 'Get Help' button opens a new browser tab with the expected help URL.
 *
 * Steps:
 * 1. Clicks the 'Get Help' button on the login page.
 * 2. Waits for a new browser tab to open.
 * 3. Waits for the new page to  load.
 * 4. Assert that the count page count should be 2
 
 */

test("TS-2 Verify 'Get' help button is functional", async ({ page, context }) => {
  // Define the expected help URL that should open in a new tab
  await loginPage.getUrl();
 expect(context.pages().length).toBe(2);

  console.log("Help page opened successfully");
});


  /**
 * Test Case: TS-3 Verify List of Reports
 *
 * Objective:
 * Ensure that the list of employee reports is fetched successfully from the PIM section.
 *
 * Steps:
 * 1. Navigate to the PIM section by clicking the PIM link.
 * 2. Click on the "Employee List" button to view reports.
 * 3. Wait for the employee list to load.
 * 4. Extract all employee IDs as text content.
 * 5. Assert that the employee list is not empty.
 */

test("TS-3 Verify List of Reports", async ({ page }) => {
 
  await PimPage.getEmpList();
  const actualEmpListElement = await page.locator("//div[@class='oxd-table-row oxd-table-row--with-border oxd-table-row--clickable']/div[2]/div").allInnerTexts(); 

  expect(actualEmpListElement.length).toBeGreaterThan(1);

  console.log(`Employee list retrieved successfully: ${actualEmpListElement.length}`);
});


/**
   * Test Case: TS-4
   * Objective: Verify that the Employee Search functionality works as expected.
   * 
   * Steps:
   * 1. Navigate to PIM > Employee List.
   * 2. Fetch an Employee ID from the list.
   * 3. Enter the same ID in the search field and perform a search.
   * 4. Use a helper function to assert that the searched Employee ID matches the original one.
   */
test("TS-4 Verify Employee List Search functionality", async ({ page }) => {
  await page.locator('//span[text()="PIM"]').click();
  await page.locator('//a[text()="Employee List"]').click();
  await page.waitForTimeout(4000);
  const list1 = await page.locator("//div[@role='row']/div[2]").allInnerTexts();
  const id = list1.find(text => text.trim() !== "") ?? "defaultId";
  await PimPage.verifyEmp(id);  
const result=   await page.locator(`//div[contains(@class, 'row') and contains(.,'${id}')]//div[2]`).allInnerTexts();
  expect(result).toContain(id);
});



/**
 * Test Case: TS-5 Verify Primary Colour of corporate branding could be changed
 *
 * Objective:
 * Ensure that the primary color under corporate branding can be updated successfully.
 *
 * Steps:
 * 1. Navigate to the Admin section.
 * 2. Click on the "Corporate Branding" tab.
 * 3. Select and modify the primary color input field.
 * 4. Click the "Publish" button to apply the changes.
 * 5. Fetch the inline style attribute to confirm the color has been applied.
 * 6. Assert that the color code matches the expected value using a helper.
 */

test("TS-5 Verify Primary Colour of corporate branding could be changed", async ({ page }) => {
  await adminPage.primaryColor(); // returns the style string
 
  const actualStyle = await page.locator("//div[@class='oxd-color-input-preview']").nth(0).getAttribute("style");
  if (actualStyle) {
    expectPrimaryColorStyle(actualStyle); // assert in helper function
  } else {
    throw new Error("actualStyle is null");
  }
});


test("TS-6 Verify Client Logo could not be uploaded above 1 mb", async ({ page }) => {
  /**
   * Test Case: TS-6
   * Objective: Verify that uploading a company logo larger than 1MB displays a validation error.
   * 
   * Steps:
   * 1. Navigate to Admin > Corporate Branding section.
   * 2. Try uploading a logo image file larger than 1MB.
   * 3. Capture and verify the validation error message.
   */

  await adminPage.companyLogo(); // Perform upload and get the error message
   const actualMessage =  await page.locator("span.oxd-text.oxd-text--span.oxd-input-field-error-message.oxd-input-group__message").textContent();
  expect(actualMessage).toBe("Attachment Size Exceeded"); // Assert that the error message matches the expected one

 
});


test("TS-7 Verify Language change Functionality", async ({ page }) => {
  /**
   * Test Case: TS-7
   * Objective: To verify that the language change functionality updates the selected language correctly.
   *
   * Steps:
   * 1. Navigate to Admin > Configuration > Localization.
   * 2. Change the language (e.g., to Chinese or other).
   * 3. Retrieve and validate the selected language text.
   */

  await adminPage.changeLanguage(); // Perform language change
  const expectedLang = [
  "Chinese (Traditional, Taiwan) - 中文（繁體，台灣）",
  "Chinese (Traditional, Taiwan) - 中文（繁體，台灣）"
];

const actualLang = await page.locator("//div[@class='oxd-select-text-input']").nth(0).textContent();

await expect(actualLang?.trim()).toBe(expectedLang[0].trim()); // ✅ compare first element
await expect(expectedLang[0]).not.toBe(""); // ✅ ensure expected is not empty
console.log(expectedLang[0]);


  // Reset back to English
  await page.locator("//div[@class='oxd-select-text oxd-select-text--active']").nth(0).click();
  await page.locator("//div[@role='listbox']//span[contains(normalize-space(), 'English (United States')]").click();
  await page.locator("//button[text()=' Save ' or text()=' 儲存 ']").click();
  await page.waitForTimeout(2000);
});


test("TS-8 Verify Required Field Error in Leaves Tab displays when required field is empty", async ({ page }) => {
  /**
   * Test Case: TS-8
   * Objective: To verify that an error message is shown when trying to assign leave without filling required fields.
   * 
   * Steps:
   * 1. Navigate to the Leave tab and open the Assign Leave section.
   * 2. Click the "Assign" button without filling in any fields.
   * 3. Capture and validate the required field error message.
   */

  await leavePage.verifyLeaveField(); // Trigger validation and get the error message
  const errorMsg =await  page.locator("//span[text()='Required']").allInnerTexts();
  expect(errorMsg).toContain("Required");
  


});


test("TS-9 Verify My info Download Functionality", async ({ page }) => {
  /**
   * Test Case: TS-9
   * Objective: Verify that clicking the 'Download' button in the My Info section
   *            correctly downloads the user details file.
   *
   * Steps:
   * 1. Navigate to My Info tab.
   * 2. Click on the Download button.
   * 3. Capture the file name and wait for the download event.
   * 4. Save the file to a known directory (downloadImage).
   * 5. Verify that the file was downloaded successfully by checking its existence.
   */

  await myinfoPage.downloadInfo();       // Download the file and return its name
  const fileName = MyInfoPage.fileName;
  if(fileName === '') {
    expect(true).toBeFalsy();
  }
  const fileExists = await isFileDownloaded(fileName);    // Check if the file exists in expected directory
  expect(fileExists).toBe(true);                           // Assert the file was downloaded successfully
});

test("TS-10 Verify User details could be Updated", async ({ page }) => {
  /**
   * Test Case: TS-10
   * Objective: Verify that user details like First Name, Middle Name, and Last Name
   *            can be updated successfully from the My Info section.
   * 
   * Steps:
   * 1. Navigate to My Info page and fill in new user details (first, middle, last name).
   * 2. Click the Save button to update information.
   * 3. Reload the page to verify if the updates were applied.
   * 4. Use an assertion helper to validate the updated values.
   */

  await myinfoPage.verifyUser();              // Fill and save user details
  await page.waitForTimeout(2000);           // Wait briefly for changes to take effect
  await assertUserDetailsUpdated(page);      // Assertion helper checks updated values
});


});

/**
 * ------------------------------------------------------Helper Methods----------------------------------------------------
 */
async function assertUrl(actualUrl: string, expectedUrl: string) {
  expect(actualUrl).toBe(expectedUrl);
}

async function assertUserDetailsUpdated(page: Page) {

  await expect(page.locator('input[name="firstName"]')).toHaveValue(data.VerifyUser.firstName);
  await expect(page.locator('input[name="middleName"]')).toHaveValue(data.VerifyUser.midName);
  await expect(page.locator('input[name="lastName"]')).toHaveValue(data.VerifyUser.lastName);
}


async function isFileDownloaded(
  fileName: string,
  directory: string = path.resolve(process.cwd(), 'downloadImage')
): Promise<boolean> {
  const filePath = path.join(directory, fileName);
  try {
    fs.accessSync(filePath);
    return true;
  } catch {
    return false;
  }
}



async function assertSortedListDescending(actualList: string[]) {
  for (let i = 0; i < actualList.length - 1; i++) {
    if (actualList[i].localeCompare(actualList[i + 1]) < 0) {
      throw new Error(
        `List is not sorted in descending order at index ${i}: '${actualList[i]}' < '${actualList[i + 1]}'`
      );
    }
  }
}

export function expectPrimaryColorStyle(actual: string) {
  const expected = "background-color: rgb(130, 97, 55); opacity: 1; cursor: pointer;";
  expect(actual.trim()).toBe(expected);
}

// utils/assertHelpers.ts



export async function assertLanuage(page: Page, actualLang: string) {
  expect(actualLang.trim()).toBe("Chinese (Traditional, Taiwan) - 中文（繁體，台灣）");
}
async function assertLeaveAssignErrorMessage(page: Page, ErrorMsg: string) {
  const locator = page.locator("//span[text()='Required']").nth(0);

  await locator.waitFor({ state: "visible" });
  const actualText = await locator.textContent();

  expect(actualText).toBe(ErrorMsg);
}
async function assertSearchedEmpId(page: Page, expectedEmpId: string) {
  const displayedEmpId = await page.locator("//div[@class='oxd-table-card']//div[@role='cell']").nth(1).textContent();
  expect(displayedEmpId?.trim()).toBe(expectedEmpId);
}



//-----
