const setupChrome = require('./src/utils/setupChrome');
const runWithRetries = require('./src/ikonInteractions/runnerWithRetries');
const loginUtils = require('./src/ikonInteractions/handleLogin');
const delay = require('./src/utils/delay');

const runner = async (logInInfo, mountain, date, buddy, retries, headless) => {
    let browser;
    let page;

    try {
        browser = await setupChrome(headless);
        page = await browser.newPage();

        await loginUtils.logInToIkon(page, logInInfo);
        await runWithRetries(page, mountain, date, retries, logInInfo, buddy);
    } catch (e) {
        console.log('Error running program, exiting now');
    }

    try {
        await delay(10000);
        if (page) await page.close();
        if (browser) await browser.close();
    } catch (e) {
        console.log('Error closing page or browser', e);
    }
};

module.exports = runner;
