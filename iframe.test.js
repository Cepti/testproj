jest.setTimeout(30000);

const { chromium, devices } = require('playwright-chromium');

let browser;

beforeAll(async () => {
    browser = await chromium.launch({
        headless:false,
        slowMo:100
    });
});

afterAll(async () => {
    await browser.close();
});

describe("browser and link", () => {
    let page;

    test("1 iframe interaction", async () => {
        const context = await browser.newContext();
        page = await context.newPage();
        await page.goto('https://www.w3schools.com/html/html_iframe.asp');

        const frame = await page.frames()[1];

        await frame.click('[href="/css/default.asp"]');                         // try to interact with iframe content

        await frame.waitForSelector('text="CSS Tutorial"');                     // check if it was sucsessful
    });
});