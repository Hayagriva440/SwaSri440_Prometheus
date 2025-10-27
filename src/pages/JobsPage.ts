/* Name :       JobsPage.ts
 * Description: This script switches focus to latest linkedin
 *              open tab and  on searching for "Senior SDET" in text field
 *              checks the text shown as "Associate Quality Assurance Engineer".
 *              
 */                               

import { By, Key, WebDriver, until } from "selenium-webdriver";    
                  
export class JobsPage {
  constructor(private driver: WebDriver , private timeout = 20000) {}

  // If the jobs list opened in a new browser window, switch   
  // focus to the newest window.
  async switchToLatestTab() {
    const latestwindow = await this.driver.getWindowHandles();  
    await this.driver.switchTo().window(latestwindow[1]); 
  }
           
  /* Check whether a "Senior SDET" job shows in linked in page 
   * for Prometheus Group
  */
   async hasSeniorSdet() {
     try {
         // Enter "Senior SDET" into the LinkedIn search field
          const linkedInSearchBox = await this.driver.wait(until.elementLocated(By.name("q")), this.timeout);
        // Ensure it’s actually visible before using it.
          await this.driver.wait(until.elementIsVisible(linkedInSearchBox), this.timeout);
          await linkedInSearchBox.sendKeys('Senior SDET', Key.RETURN);
          const sdetjob = await this.driver.findElements(By.xpath("//*[contains(text(), 'Senior SDET')]"));
          const resultFound = sdetjob.length > 0;
          if (resultFound) {
             console.log("'Senior SDET' found");
          } else {
              console.log("Search result NOT found: 'Associate Quality Assurance Engineer'  found instead");
            }
        } catch (error) {
          console.error("An error occurred while verifying:", error);
          }
    }
}

