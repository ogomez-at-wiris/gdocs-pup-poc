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
    await page.goto('https://docs.google.com/document/d/1-DXdfm6zTGDWz9Ygw_nYDvHHqnJm8UPudPZNo6C3rSs/edit')
    await page.click('#docs-extensions-menu')
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
    // let bodyHTML = await sandboxContent.content();
    const userFrame = await sandboxContent.waitForSelector('iframe')
    console.log('got user frame');
    const userContent = await userFrame.contentFrame()
    console.log('content');
    let app = await userContent.waitForSelector('#app');
    console.log('app found!');
    let canvas = await page.waitForSelector('canvas');
    await canvas.screenshot({
        path: 'example.png'
    });
    console.log('screenshot made')

    const openMathtypeButton = await app.waitForXPath('//button[contains(., "Open MathType")]/*')
    await openMathtypeButton.click();

    console.log('getting frame modal dialog app');
    await page.waitForTimeout(18000);
    const modalDialogFrame = await page.waitForXPath('//div[@class="modal-dialog-content script-app-contents"]/iframe')
    console.log('got iframe');

    const modalDialogFrameContent = await modalDialogFrame.contentFrame();
    console.log('got content', util.inspect(await modalDialogFrameContent.content()));
    const modalSandbox = await modalDialogFrameContent.waitForSelector('#sandboxFrame')
    console.log('got sandbox');
    const modalSandboxContent = await modalSandbox.contentFrame();
    console.log('got sandbox content');
    // let bodyHTML = await sandboxContent.content();
    const modalUserFrame = await modalSandboxContent.waitForSelector('iframe')
    console.log('got user frame');
    const modalUserContent = await modalUserFrame.contentFrame()
    console.log('content');

    app = await modalUserContent.waitForSelector('#app');
    console.log('got editor app');
    const input = await app.waitForSelector('#editorContainer');
    console.log('got input');
    await input.type('123');
    console.log('typed');
    await app.click('#insert-button')
    console.log('clicked insert');
    await page.waitForTimeout(5000);
    canvas = await page.waitForSelector('canvas');
    await canvas.screenshot({
        path: 'example_equation.png'
    });
    console.log('screenshot made')

}

main();
