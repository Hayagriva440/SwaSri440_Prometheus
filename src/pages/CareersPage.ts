/* Name        : Careers page
*  Description :  check 4 accordion items + click "VIEW OPEN PROMETHEUS JOBS"
*/

import { By, Key, WebDriver, until } from "selenium-webdriver";

export class CareersPage {
       constructor(private driver: WebDriver, private timeout = 20000) {
       this.driver = driver;  // Assigning to the class property
       
    }

 
  /**
   * Verify that at least `minCount` accordion items:
   *  - can be clicked open
   *  - show some non-empty text content
   *  - can be clicked closed
   * Returns the number of accordions verified (we expect 4).
   */
       async verifyFourAccordionsToggle(minCount = 4) {
       // Give the page a moment to finish rendering/mounting components
       // Set implicit wait time (e.g., 10 seconds)
       await this.driver.manage().setTimeouts({ implicit: 10000 });

      // Find likely accordion toggles using *generic* patterns:
      //  - buttons with aria-controls / aria-expanded (common accessibility attributes)
      //  - class containing "accordion"
      //  - native <details><summary> accordions
       const toggles = await this.driver.findElements(By.xpath("//button[@aria-controls or @aria-expanded or " +
                       "contains(translate(@class,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'accordion')]" +
                       " | //details/summary"
    ));
      
    // If we didn’t find enough toggles, fail with a clear message
     if (toggles.length < minCount) {
        throw new Error(`Expected at least ${minCount} accordions, found ${toggles.length}`);
      }

    // Count how many we successfully verify
    let checked = 0;

    // Only test the first `minCount` toggles to keep the test quick and stable
    for (const t of toggles.slice(0, minCount)) {
      // Scroll the toggle into view so the click is reliable
      await this.driver.executeScript("arguments[0].scrollIntoView({block:'center'})", t);

      // Click to open the accordion
      await t.click();
      await this.driver.manage().setTimeouts({ implicit: 10000 });
      let content = "";
      const ariaControls = await t.getAttribute("aria-controls");
      if (ariaControls) {
        try {
          const panel = await this.driver.findElement(By.id(ariaControls));
          content = (await panel.getText()).trim();
        } catch {
          
        }
      }

      

      // If we still have no content after clicking the accordian, it fails 
      if (!content) throw new Error("Accordion opened but no text found");

      // Try to close the accordion again
      try { 
        await t.click(); 
      } catch {
           
      }

      // Increment our count of verified accordions
      checked++;
    }

    // Return how many we verified (the test expects exactly 4)
    return checked;
  }

  // Click the "VIEW OPEN PROMETHEUS JOBS" link
  async clickViewAllJobs(): Promise<boolean> {
    
    const candidates = await this.driver.findElements(By.xpath(
      "//a[normalize-space()='VIEW OPEN PROMETHEUS JOBS']"));

    // Try to click the first candidate that responds
    for (const el of candidates) {
      try {
        // Scroll into view for a reliable click
        await this.driver.executeScript("arguments[0].scrollIntoView({block:'center'})", el);
        await el.click();
        return true; // success
      } catch {
        // If clicking fails (e.g., covered by another element), try the next candidate
      }
    }

    // No matching/clickable link found
    return false;
  }
}
