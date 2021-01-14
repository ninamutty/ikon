const puppeteer = require('puppeteer');
const chromeLauncher = require('chrome-launcher');
const util = require('util');
const request = require('request');

const FIVE_MINUTES = 1000 * 60 * 5;

function delay(time) {
    return new Promise(function(resolve) {
        setTimeout(resolve, time);
    });
}

const logInToIkon = async page => {
    // navigate to ikon
    await page.goto('https://account.ikonpass.com/en/login', {
        waitUntil: 'domcontentloaded',
        timeout: 180000, //180 seconds
    });

    console.log('logging in');
    const emailInput = await page.$('#email');
    await emailInput.type('ninamutty@gmail.com');
    const passwordInput = await page.$('#sign-in-password');
    await passwordInput.type('rZ78qeZkeWVzCmG');
    // console.log(passwordInput, "passwordInput");

    const submitBtn = await page.$('.submit');

    await Promise.all([
        page.waitForNavigation({
            waitUntil: ['networkidle0', 'domcontentloaded'],
        }),
        submitBtn.click(),
    ]);
};

const chooseMountainToReserve = async (page, mountain) => {
    console.log('navigating to reservations');
    await page.goto('https://account.ikonpass.com/en/myaccount/add-reservations/', {
        waitUntil: ['networkidle0', 'domcontentloaded'],
        timeout: 180000, //180 seconds
    });

    console.log('selecting mountain');
    const crystalMtnBtn = await page.$x(`//span[contains(., '${mountain}')]`);
    const parent = (await crystalMtnBtn[0].$x('..'))[0];
    await parent.click();

    await delay(1000);
    const continueBtn = await page.$x("//button[contains(., 'Continue')]");

    await continueBtn[0].click();
};

const findMonth = async (page, month, year) => {
    const monthElem = await page.$x(`//span[contains(., '${month} ${year}')]`);

    if (!(monthElem.length > 0)) {
        console.log('Moving to next month');
        const nextBtn = await page.$('.icon-chevron-right');
        (await nextBtn) && nextBtn.click();

        await delay(1000);
        return findMonth(page, month, year);
    }
    return true;
};

const selectDay = async (page, day) => {
    console.log('Finding the correct day');
    const dayPickerDays = await page.$$('.DayPicker-Day');

    for (let i = 0; i < dayPickerDays.length; i++) {
        const temp = await dayPickerDays[i].$eval('div', e => e.innerText);
        if (temp === day) {
            dayPickerDays[i].click();
        }
    }
};

const tryConfirming = async (page, mountain, month, day, year, retries) => {
    const saveBtn = await page.$x(`//span[contains(., 'Save')]`);
    if (saveBtn.length === 0) {
        return false;
    } else {
        try {
            const saveBtnParent = (await saveBtn[0].$x('..'))[0];
            await saveBtnParent.click();
            await delay(500);

            const confirm = await page.$x(`//span[contains(., 'Continue to Confirm')]`);
            if (confirm) {
                const confirmBtnParent = (await confirm[1].$x('..'))[0];
                if (confirmBtnParent) {
                    await confirmBtnParent.click();
                    await delay(1000);

                    console.log('Review and Confirm');
                    const agreeInputLabel = await page.$('.amp-checkbox-input');
                    const agreeInputParent = (await agreeInputLabel.$x('..'))[0];
                    await agreeInputParent.click();

                    const confirmFinal = await page.$x(`//span[contains(., 'Confirm Reservations')]`);
                    const confirmFinalBtnParent = (await confirmFinal[0].$x('..'))[0];
                    await confirmFinalBtnParent.click();

                    return true;
                } else {
                    return false;
                }
            }
        } catch (e) {
            throw new Error('Error thrown confirming day');
        }
    }
};

const selectMountainAndCheckDay = async (page, mountain, month, day, year) => {
    await chooseMountainToReserve(page, mountain);

    await delay(500);
    await findMonth(page, month, year);

    await selectDay(page, day);
    await delay(500);
};

const waitFiveMinutesAndRetry = async (page, mountain, month, day, year, retries) => {
    await delay(FIVE_MINUTES); // wait five minutes;
    await page.reload({
        waitUntil: ['networkidle0', 'domcontentloaded'],
    });

    // check if session expired
    const sessionExpired = await page.$x(`//h1[contains(., 'Session Expired')]`);
    if (sessionExpired.length > 0) {
        console.log('Session Expired! Logging in again');
        // close the modal first, then login
        const closeBtn = await page.$('.modal-primary-action.button-confirm');
        await closeBtn.click();
        await delay(500);
        await logInToIkon(page);
    }

    await runWithRetries(page, mountain, month, day, year, retries - 1);
};

const runWithRetries = async (page, mountain, month, day, year, retries) => {
    try {
        await selectMountainAndCheckDay(page, mountain, month, day, year);
        const spotReserved = await tryConfirming(page, mountain, month, day, year, retries);

        if (spotReserved) {
            console.log(`Space reserved for ${month} ${day} ${year}!!`);
            return true;
        } else if (retries > 0) {
            console.log(`date not available - waiting five minutes and retying. Retries left: ${retries}`);
            await waitFiveMinutesAndRetry(page, mountain, month, day, year, retries);
        } else {
            console.log('Exhausted retries');
            return false;
        }
    } catch (e) {
        console.log(e);
        if (retries > 0) {
            console.log(`Waiting five minutes and retying - Retries left: ${retries}`);
            await waitFiveMinutesAndRetry(page, mountain, month, day, year, retries);
        } else {
            return false;
        }
    }
};

const runner = async (mountain, month, day, year) => {
    const headless = false; // set to false to see the test run
    const opts = {
        logLevel: 'info',
        output: 'json',
        chromeFlags: ['--disable-gpu', headless ? '--headless' : '', '--incognito'],
        emulatedFormFactor: 'desktop',
        executablePath: process.env.CHROME_BIN || null,
    };

    // Launch chrome using chrome-launcher.
    console.log('Launching Chrome');
    const chrome = await chromeLauncher.launch(opts);
    opts.port = chrome.port;

    // Connect to it using puppeteer.connect().
    console.log('Connecting puppeteer to chrome');
    const resp = await util.promisify(request)(`http://localhost:${opts.port}/json/version`);
    const { webSocketDebuggerUrl } = JSON.parse(resp.body);
    const browser = await puppeteer.connect({
        browserWSEndpoint: webSocketDebuggerUrl,
    });
    const page = await browser.newPage();

    await logInToIkon(page);

    await runWithRetries(page, mountain, month, day, year, 30);
    await delay(10000);
    await page.close();
    await browser.close();
};

runner('Crystal Mountain Resort', 'January', '18', '2021');

/*
 * More things to do
 *
 * multi-day select
 * input verification
 * search for mountain
 * build it into a webapp?
 * automatically reserve/cancel based on NOAA weather forcast --> build into google calendar
 */
// multi day select
// input verification
// search for mountain
