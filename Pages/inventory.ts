//imports
import { Page, Locator } from '@playwright/test';

//locators
export class InventoryPage {
readonly page: Page;
readonly shoppingCartIcon: Locator;
readonly inventoryItems: Locator;
readonly cartBadge: Locator;

//constructor
constructor(page: Page) {
    // 3. Save it so the methods can use it later

    this.page = page;

    // 4. Define the locators once, all in one place
    this.shoppingCartIcon = page.getByTestId('shopping-cart-link');
    this.inventoryItems = page.getByTestId('inventory-item');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
  }

//functions or actions

 // Adds the first `count` products on the page (no product is hard-coded)
 // and returns their names so the test can check them in the cart.
 async addItemsToCart(count: number): Promise<string[]> {
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      const item = this.inventoryItems.nth(i);
      names.push(await item.getByTestId('inventory-item-name').innerText());
      await item.getByRole('button', { name: 'Add to cart' }).click();
    }
    return names;
  }

 async navigateToCart() {
    await this.shoppingCartIcon.click();
  }
}
