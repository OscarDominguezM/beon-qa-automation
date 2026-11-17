//imports
import { Page, Locator } from '@playwright/test';

//locators
export class LoginPage {
readonly page: Page;
readonly loginButton: Locator;
readonly username: Locator;
readonly password: Locator;

//constructor
constructor(page: Page) {
    // 3. Save it so the methods can use it later

    this.page = page;

    // 4. Define the locators once, all in one place
    this.username = page.getByTestId('username');
    this.password = page.getByTestId('password');
    this.loginButton = page.getByTestId('login-button');
  }

//functions or actions

async goto() {
    await this.page.goto('/');
  }


 async login(username: string, password: string) {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.loginButton.click();
  }
}
