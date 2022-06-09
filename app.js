require("dotenv").config();
const fs = require("fs");
const { Builder, By, Key, until } = require("selenium-webdriver");
const schedule = require("node-schedule");
const axios = require("axios");
const FormData = require("form-data");

const sendSMS = schedule.scheduleJob("0 0 * * * *", async function () {
  const smsData = new FormData();
  smsData.append("key", process.env.smsKey);
  smsData.append("userid", process.env.smsUserId);
  smsData.append("sender", process.env.smsSender);
  smsData.append("msg", "");
  smsData.append("msg_type", "");
  smsData.append("title", "안녕하세요");
  smsData.append("destination", "");

  let driver = await new Builder().forBrowser("chrome").build();
  try {
    await driver.get(process.env.spaceCloudLoginURL);

    let idInput = await driver.findElement(By.id("email"));
    idInput.sendKeys(process.env.ID);

    let pwInput = await driver.findElement(By.id("pw"));
    pwInput.sendKeys(process.env.PW, Key.RETURN);

    await driver.wait(until.elementLocated(By.className("login_state")), 10000);

    await driver.get(process.env.spaceCloudReservationURL);

    let reservationNum = await driver.findElements(
      By.className("reservation_num")
    );
    let phoneNum = await driver.findElements(By.className("tel"));

    const data = fs.readFileSync("prevReserved.json");
    const prevReserved = JSON.parse(data.toString());
    let reserved = [];
    let reservedSmsNotSent = [];
    for (let i = 0; i < reservationNum.length; i++) {
      reserved.push({
        reservationNum: (await reservationNum[i].getText()).replace(/\D/gi, ""),
        phoneNum: (await phoneNum[i].getText()).replace(/\D/gi, ""),
      });
      if (!prevReserved.includes(reserved[i].reservationNum)) {
        reservedSmsNotSent.push(reserved[i].phoneNum);
      }
    }

    //SMS 보내기
    if (reservedSmsNotSent.length) {
      let receivers = reservedSmsNotSent.join(",");
      smsData.append("receiver", receivers);

      try {
        const response = await axios.post(process.env.smsURL, smsData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log(response);
      } catch (err) {
        console.log(err);
      }
    }

    fs.writeFileSync(
      "prevReserved.json",
      JSON.stringify(reserved.map((item) => item.reservationNum))
    );
  } finally {
    driver.quit();
  }
});
