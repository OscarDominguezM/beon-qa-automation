//imports
import { Page, Locator } from '@playwright/test';

//locators
export class CartPage {
readonly page: Page;
readonly itemNames: Locator;
readonly itemQuantities: Locator;
readonly checkoutButton: Locator;

//constructor
constructor(page: Page) {
    // 3. Save it so the methods can use it later

    this.page = page;

    // 4. Define the locators once, all in one place
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemQuantities = page.getByTestId('item-quantity');
    this.checkoutButton = page.getByTestId('checkout');
  }

//functions or actions

 async goToCheckout() {
    await this.checkoutButton.click();
  }
}
