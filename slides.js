const Puppeteer = require("puppeteer");
const util = require('util');
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
    await page.goto('https://docs.google.com/presentation/d/1VpVdOqw6rOYg5eNDiPP6EjX751xEf4u3qlt1D7nU9Mg/edit')
    await page.waitForTimeout(5000);
    // get all image html tags present
    const images = await page.evaluate(() => {
        const images = document.querySelectorAll('image');
        return Array.from(images);
    });
    console.log('found image count', images.length);


    console.log('deleting equations');
    await page.keyboard.down('Control');
    await page.keyboard.press('KeyA');
    await page.keyboard.up('Control');
    await page.keyboard.press('Delete');

    await page.keyboard.down('Alt');
    await page.keyboard.press('KeyN');
    await page.keyboard.up('Alt');
    await page.waitForTimeout(1000);
    const betaElement = await page.waitForXPath('//*[@id="M7QBcEIXAo8qRwgHek537QAI9Xc9qMK8g"]/div')
    await betaElement.click();
    const element = await page.waitForXPath('//div[contains(., "Open MathType")]/*')
    await element.click();
    const frame = await page.waitForSelector('body > div.script-application-sidebar > div.script-application-sidebar-content > iframe');
    console.log('got frame');
    const frameContent = await frame.contentFrame();
    console.log('content');
    const sandbox = await frameContent.waitForSelector('#sandboxFrame')
    console.log('got sandbox');
    const sandboxContent = await sandbox.contentFrame();
    console.log('got sandbox content');
    await page.waitForTimeout(10000)

    const userFrame = await sandboxContent.waitForSelector('iframe')
    console.log('got user frame');
    const userContent = await userFrame.contentFrame()
    console.log('content');
    let app = await userContent.waitForSelector('#app');
    console.log('app found!');

    const openMathtypeButton = await app.waitForXPath('//button[contains(., "Open MathType")]/*')
    await openMathtypeButton.click();

    console.log('getting frame modal dialog app');
    await page.waitForTimeout(18000);
    const modalDialogFrame = await page.waitForXPath('//div[@class="modal-dialog-content script-app-contents"]/iframe')
    console.log('got iframe');

    const modalDialogFrameContent = await modalDialogFrame.contentFrame();
    console.log('got content');
    const modalSandbox = await modalDialogFrameContent.waitForSelector('#sandboxFrame')
    console.log('got sandbox');
    const modalSandboxContent = await modalSandbox.contentFrame();
    console.log('got sandbox content');
    const modalUserFrame = await modalSandboxContent.waitForSelector('iframe')
    console.log('got user frame');
    const modalUserContent = await modalUserFrame.contentFrame()
    console.log('content');

    modalApp = await modalUserContent.waitForSelector('#app');
    console.log('got editor app');
    let input = await modalApp.waitForSelector('#editorContainer input');
    await input.focus();
    console.log('got input');
    await input.type('123');
    console.log('typed');
    await page.waitForTimeout(1000);
    const insertButton = await modalApp.waitForXPath('//button[@id="insert-button"]')
    await insertButton.click();
    console.log('clicked insert');
    await page.waitForTimeout(8000);
    await page.keyboard.press('Tab')
    await openMathtypeButton.click();
    console.log('click open mt');
}

main();
