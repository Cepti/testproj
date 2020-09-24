jest.setTimeout(200000);

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

    test("1 logo navigation between subdomains", async () => {
        const context = await browser.newContext();
        page = await context.newPage();
        await page.goto('https://bitaps.com');

        await page.click('.bitcoin-logo');

        await page.click('[href="https://ltc.bitaps.com"]');

        await page.waitForSelector('.litecoin-logo');               // expect moving to litecoin subdomain
    });

    test("2 search for mined BTC block", async () => {
        const context = await browser.newContext();
        page = await context.newPage();
        await page.goto('https://bitaps.com');

        await page.type('#search-box','649771');                    // input previously mined block number

        await page.press('body', 'Enter');                          // running search

        const page2 = await context.pages()[0];

        await page2.waitForSelector('.cbwrap');                     // checking if we are on the right page
    });

    test("3 mnemonic tool functionality", async () => {
        const context = await browser.newContext();
        page = await context.newPage();
        await page.goto('https://btc.bitaps.com/mnemonic');

        await page.click('[for="option-21"]');                              // choose to create a 21 word phrase

        await page.click('#gen-mnemonic-btn');                              

        await page.waitForSelector('.word-21');                             // checking if 21-th word exist

        await page.waitForSelector('.word-22', { state: 'detached' });      // checking if 22-th word doesn't exist
    });

    test("4 error message in address tool", async () => {
        const context = await browser.newContext();
        page = await context.newPage();
        await page.goto('https://bitaps.com/address');

        await page.type('#load-key-input','randomNumber');                  // typing an invalid key address

        await page.click('#load-key-btn');

        await page.waitForSelector('text="private/public key invalid"');    // checking if an error message apeears
    });

    test("5 bitcoin mixer tool randomizer", async () => {
        const context = await browser.newContext();
        page = await context.newPage();
        await page.goto('https://btc.bitaps.com/mixer');

        const initialValue = await page.innerText('.address-delay-label');      // initial payout delay value
        
        await page.click('#randomize-delay');

        const randomizedValue = await page.innerText('.address-delay-label');   // payout delay value after using randomize button

        expect(initialValue - randomizedValue).not.toBe(0);                     // check if payout delay value has changed after randomizing
    });
});