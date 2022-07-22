const Puppeteer = require("puppeteer");
const env = require('dotenv').config();

const main = async () => {
    const browser = await Puppeteer.launch({
        headless: false,
    });
    const page = await browser.newPage();

    await page.setUserAgent(process.env.USER_AGENT);

    await page.goto('https://docs.google.com');

    await page.type('#identifierId', process.env.EMAIL);
    await page.click('#identifierNext');
    await page.waitForSelector('input[type="password"]', { visible: true });
    await page.type('input[type="password"]', process.env.PASSWORD);
    await page.keyboard.press('Enter')
    await page.waitForNavigation();
    await page.goto('https://docs.google.com/document/d/1-DXdfm6zTGDWz9Ygw_nYDvHHqnJm8UPudPZNo6C3rSs/edit')
    console.log('ok!');
}

main();
