package lt.rebellion.base;

import com.codeborne.selenide.Configuration;
import org.junit.jupiter.api.BeforeEach;

import java.io.File;

import static com.codeborne.selenide.Selenide.open;

public class BaseTest {
    String webAppUrl = "http://localhost:3000/";

    @BeforeEach
    void startTest() {

        /** Screenshot after each tests is disabled */
        Configuration.screenshots = false;

        /** Tests runs in the background */
        Configuration.headless = false;

        /** Does not save url of page */
        Configuration.savePageSource = false;

        /** Leaves browser open when test is finished */
        Configuration.holdBrowserOpen = true;

        /** Opens web app */
        open(webAppUrl);
    }
}
