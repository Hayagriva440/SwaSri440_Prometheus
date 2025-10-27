import { Builder, ThenableWebDriver } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

export async function buildDriver(): Promise<ThenableWebDriver> {
  const headless = process.env.HEADLESS === "1";
  const options = new chrome.Options();
  options.addArguments("--window-size=1600,1000");
  options.addArguments("--start-maximized");
  if (headless) {
    options.addArguments("--headless=new");
  }

  // chromedriver is brought in by dependency; selenium-webdriver will find it from PATH/node_modules/.bin
  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  return driver;
}
