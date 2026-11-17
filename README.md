# BEON QA Automation Exercise

Playwright + TypeScript suite covering:

- **API:** the full booking lifecycle on [Restful-Booker](https://restful-booker.herokuapp.com) (auth → create → read → update → delete).
- **UI:** the end-to-end purchase flow on [SauceDemo](https://www.saucedemo.com) (login → add two items → cart → checkout → confirmation).

## Prerequisites

- Node.js 18 or newer (`node -v`)
- npm (comes with Node)
- Internet access (both targets are public sites)

## Installation

```bash
npm install
npx playwright install chromium
```

## Running the tests

| What | Command |
|---|---|
| All tests (headless) | `npm test` |
| API only | `npm run test:api` |
| UI only | `npm run test:ui` |
| UI with visible browser | `npm run test:headed` |
| Playwright UI mode | `npm run ui` |
| Open HTML report | `npm run report` |
| Type-check only | `npm run typecheck` |

Reporting: the Playwright HTML reporter runs on every execution (output in `playwright-report/`). Traces and screenshots are kept for failed tests.

## Framework architecture

```
├── Api/
│   └── BookingClient.ts        # one method per Restful-Booker endpoint
├── Pages/                      # Page Object Model, one class per screen
│   ├── LoginPage.ts
│   ├── inventory.ts            # InventoryPage
│   ├── Cart.ts                 # CartPage
│   └── Checkout.ts             # CheckoutPage: information, overview and complete screens
├── Fixtures/
│   ├── pages.ts                # Playwright fixtures that inject the page objects
│   └── testData.ts             # users, checkout info, booking payloads
├── tests/
│   ├── api/booking-lifecycle.spec.ts
│   └── ui/checkout.spec.ts
└── playwright.config.ts        # two projects: "api" and "ui", each with its own baseURL
```

**Key decisions**

- **Two Playwright projects.** `api` and `ui` have separate base URLs and settings, so each suite runs on its own with `--project`.
- **Page Object Model.** Each page class holds its locators (in the constructor) and user actions (`login`, `addItemsToCart`, `navigateToCart`, `goToCheckout`). Assertions stay in the tests, so page objects describe *what you can do* and tests decide *what should happen*.
- **Fixtures instead of `new`.** `Fixtures/pages.ts` extends Playwright's `test`, so a test simply asks for `loginPage`, `cartPage`, etc. This removes repeated setup (DRY).
- **Locator strategy.** SauceDemo exposes `data-test` attributes, so `testIdAttribute` is set to `data-test` and locators use `getByTestId()`. Buttons inside a product card use `getByRole('button', { name })`, scoped to that card. No XPath and no layout-based CSS.
- **Waits.** No fixed sleeps. Playwright actions auto-wait, and web-first assertions (`toHaveURL`, `toHaveText`) retry until the page reaches the expected state, which also confirms each page transition.
- **Dynamic item selection.** `addItemsToCart(2)` picks the first two products listed, reads their names and returns them. The cart is then checked against those names, so nothing is tied to a specific product.
- **API chaining.** The API tests run in serial mode and share state: the token from step 1 and the `bookingid` from step 2 are reused by the read, update and delete steps. Restful-Booker expects the token as a `Cookie: token=...` header. The update step re-reads the booking to confirm the change was stored, and the delete step confirms with a `GET` that returns `404`.
- **Test data in one place.** All credentials and payloads live in `Fixtures/testData.ts`.

## Bug report (problem_user)

### BUG-1: Typing in "Last Name" on checkout overwrites "First Name" and leaves Last Name empty

**Description:** On the checkout information screen, text typed into the Last Name field is written into the First Name field instead. The Last Name field stays empty, so the user can't get past this step and can't complete a purchase.

**Environment:** https://www.saucedemo.com, user `problem_user`, Chromium (Playwright 1.64), Windows 10.

**Steps to reproduce:**
1. Log in as `problem_user` / `secret_sauce`.
2. Add any product to the cart and open the cart.
3. Click **Checkout**.
4. Type `Jane` in **First Name**.
5. Type `Tester` in **Last Name**.

**Expected result:** First Name shows `Jane`, Last Name shows `Tester`.

**Actual result:** First Name shows `Tester` and Last Name is empty. Clicking Continue shows "Error: Last Name is required".

**Severity:** Critical. It blocks the checkout flow, so no order can be placed.

### BUG-2: All products show the same placeholder image

**Description:** On the inventory page every product shows the same image (`/assets/sl-404-*.jpg`) instead of its own product photo.

**Steps to reproduce:**
1. Log in as `problem_user` / `secret_sauce`.
2. Look at the product images on the inventory page.

**Expected result:** Each product shows its own photo.

**Actual result:** All 6 products show the same image.

**Severity:** Medium. Doesn't block purchase, but users can't visually identify products.
