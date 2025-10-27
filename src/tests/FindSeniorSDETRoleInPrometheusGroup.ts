/**
 * Name        : FindSeniorSDETRoleInPrometheusGroup.ts
 * Description : This is the calling script which calls functions from the page object class
 *               files.
 */

import { expect } from "chai";
import { buildDriver } from "../../utils/driver.js";
import { GooglePage } from "../pages/GooglePage.js";
import { CareersPage } from "../pages/CareersPage.js";
import { JobsPage } from "../pages/JobsPage.js";

// Ensure 'chrome' driver is set up correctly
 const driver = await new Builder().forBrowser('chrome').build(); 

describe("Prometheus Group Careers Flow", function () {
  this.timeout(70000);

  let driver: Awaited<ReturnType<typeof buildDriver>>;

  before(async () => {
    driver = await buildDriver();
  });

  after(async () => {
    await driver.quit();
  });

  
  afterEach(async function () {
    
  });

  it("completes the Google → Careers → Jobs → Senior SDET flow", async () => {
    try
    {
    const g = new GooglePage(driver);
    await g.open();
    await g.acceptConsentIfPresent();
    await g.search("Prometheus Group");
    expect(await g.resultsContain("Prometheus Group")).to.equal(true);
    expect(await g.clickPrometheusCareers()).to.equal(true);

    const c = new CareersPage(driver);
    
    expect(await c.verifyFourAccordionsToggle(4)).to.equal(4);
    expect(await c.clickViewAllJobs()).to.equal(true);

    const j = new JobsPage(driver);
    await j.switchToLatestTab();
    expect(await j.hasSeniorSdet()).to.equal(true);
    }
    catch (error) {
        console.error('Test failed:', error); 

    }
    
  
  }
)

});

