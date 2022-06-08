require("dotenv").config();
const fs = require("fs");
const { Builder, By, Key, until } = require("selenium-webdriver");
const spaceCloudLoginURL = "https://partner.spacecloud.kr/auth/login";
const spaceCloudReservationURL =
  "https://partner.spacecloud.kr/reservation?RSV_STAT_CD=RSCMP&page=1";
(async function main() {
  // let driver = await new Builder().forBrowser("chrome").build();
  try {
    // await driver.get(spaceCloudLoginURL);

    // let idInput = await driver.findElement(By.id("email"));
    // idInput.sendKeys(process.env.ID);

    // let pwInput = await driver.findElement(By.id("pw"));
    // pwInput.sendKeys(process.env.PW, Key.RETURN);

    // await driver.wait(until.elementLocated(By.className("login_state")), 10000);

    // await driver.get(spaceCloudReservationURL);
    const prevReserved = [];
    fs.writeFileSync("prevReserved.json", JSON.stringify(prevReserved));

    const data = fs.readFileSync("prevReserved.json");
    console.log(JSON.parse(data.toString()));
  } finally {
    //driver.quit();
  }
})();
