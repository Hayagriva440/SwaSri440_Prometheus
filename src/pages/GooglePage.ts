/* Name        :  GooglePage.ts
*  Description : This is a script which has functions for opening google.com page
*                and searching for Prometheus Group page.
*/

import { By, Key, WebDriver, until } from "selenium-webdriver";

//  class for Google's search page.
export class GooglePage {
   
  //Methods in this class can use these private fields.
   constructor(private driver: WebDriver, private timeout = 20000) {
        this.driver = driver;  // Assigning to the class property
       // this.timeout = 20000;
    }

    // Open google.com url in  browser. 
    async open(url = "http://www.google.com/") {
         await this.driver.get(url); // Navigate the browser to the given URL.
    }

    // Try to accept Google's region/consent dialog if it appears.
    // If it doesn't show up, we just move on without failing.
    async acceptConsentIfPresent() {
        const selectors = [
          By.xpath("//button//*[contains(., 'I agree')]/ancestor::button"),
          By.xpath("//button//*[contains(., 'Accept all')]/ancestor::button"),
          By.xpath("//div[@role='dialog']//button[.//*[contains(.,'Accept') or contains(.,'agree')]]")
        ];

    // Loop through possible buttons; click the first one we successfully find & see.
      for (const sel of selectors) {
        try {
          // Wait up to 2s for the button to exist in the DOM.
           const el = await this.driver.wait(until.elementLocated(sel), this.timeout);
           // Wait up to 2s for the button to be visible (not hidden).
           await this.driver.wait(until.elementIsVisible(el), this.timeout);
           // Click the first button
           await el.click();
           break;
        } catch {
        console.log("There is no consent dialog open");
      }
    }
  }

  // Type a search input text into the main search box and submit.
  async search(inputText: string) {
    // Wait (up to this.timeout ms) for the search input with name="q" to be present.
    const searchBox = await this.driver.wait(until.elementLocated(By.name("q")), this.timeout);
    await this.driver.wait(until.elementIsVisible(searchBox), this.timeout);
    // Type the inputText, then press ENTER to submit.
    await searchBox.sendKeys(inputText, Key.RETURN);
  }

  // Check that the results page contains a specific text in any result title.
  async resultsContain(text: string) {
    // Wait for search result headings (<h3>) to appear within the main search area.
    const results = await this.driver.wait(
      until.elementsLocated(By.css("div#search h3")),
      this.timeout
    );
    
  }

  // From the Google results, click a link "Careers".
  async clickPrometheusCareers(): Promise<boolean> {
    // Find all result links that have an <h3> inside (typical for Google result cards).
    const links = await this.driver.findElements(By.xpath("//a[.//h3]"));
   
    for (const a of links) {
      const href = ((await a.getAttribute("href")) || "").toLowerCase();
      const label = ((await a.getText()) || "").toLowerCase();

      if ((label.includes("Careers"))) {
        await a.click();
        return true;
      }
    }
   // If Careers not found, returns false.
    return false;
  }
}
