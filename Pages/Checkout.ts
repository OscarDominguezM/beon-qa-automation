//imports
import { Page, Locator } from '@playwright/test';

export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

//locators
export class CheckoutPage {
readonly page: Page;
readonly firstName: Locator;
readonly lastName: Locator;
readonly postalCode: Locator;
readonly continueButton: Locator;
readonly finishButton: Locator;
readonly completeHeader: Locator;

//constructor
constructor(page: Page) {
    // 3. Save it so the methods can use it later

    this.page = page;

    // 4. Define the locators once, all in one place
    this.firstName = page.getByTestId('firstName');
    this.lastName = page.getByTestId('lastName');
    this.postalCode = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.finishButton = page.getByTestId('finish');
    this.completeHeader = page.getByTestId('complete-header');
  }

//functions or actions

 async fillInformation(info: CheckoutInfo) {
    await this.firstName.fill(info.firstName);
    await this.lastName.fill(info.lastName);
    await this.postalCode.fill(info.postalCode);
    await this.continueButton.click();
  }

 async finishPurchase() {
    await this.finishButton.click();
  }
}
