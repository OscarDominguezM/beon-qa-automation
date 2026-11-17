import { test, expect } from '../../Fixtures/pages';
import { users, checkoutInfo } from '../../Fixtures/testData';

test('standard user buys two items end to end', async ({
  page,
  loginPage,
  inventoryPage,
  cartPage,
  checkoutPage,
}) => {
  await test.step('Login', async () => {
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(page).toHaveURL(/inventory\.html/);
  });

  let addedItems: string[] = [];
  await test.step('Add two distinct items', async () => {
    addedItems = await inventoryPage.addItemsToCart(2);
    expect(new Set(addedItems).size).toBe(2);
    await expect(inventoryPage.cartBadge).toHaveText('2');
  });

  await test.step('Verify cart', async () => {
    await inventoryPage.navigateToCart();
    await expect(page).toHaveURL(/cart\.html/);
    await expect(cartPage.itemNames).toHaveText(addedItems);
    await expect(cartPage.itemQuantities).toHaveText(['1', '1']);
  });

  await test.step('Fill checkout form', async () => {
    await cartPage.goToCheckout();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
    await checkoutPage.fillInformation(checkoutInfo);
    await expect(page).toHaveURL(/checkout-step-two\.html/);
  });

  await test.step('Complete purchase', async () => {
    await checkoutPage.finishPurchase();
    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });
});
