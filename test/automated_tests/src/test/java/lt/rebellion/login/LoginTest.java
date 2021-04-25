package lt.rebellion.login;

import lt.rebellion.base.BaseTest;
import lt.rebellion.locators.Locators;
import org.junit.jupiter.api.Test;

import static com.codeborne.selenide.Selenide.$;

public class LoginTest extends BaseTest {
    Locators locator = new Locators();

    String userLoginEmail = "user@mail.com";
    String userLoginPass = "user";
    String headerLogin = "Login";

    @Test
    void isAbleToLoginToAppAndLogOut() {
        $(locator.signInEmailLocator).sendKeys(userLoginEmail);
        $(locator.signInPasswordLocator).sendKeys(userLoginPass);
        $(locator.signInSubmitButtonLocator).click();
        $(locator.headerUsersEmailLogInLocator).getText().contains(userLoginEmail);
        $(locator.headerLogoutButtonLocator).click();
        $(locator.headerLoginButtonLocator).getText().contains(headerLogin);
    }
}
