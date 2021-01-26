const loginUtils = require('./handleLogin');
const selectMountainAndCheckDay = require('./selectMountainAndDay');
const tryConfirming = require('./tryConfirming');
const delay = require('../utils/delay');

const FIVE_MINUTES = 1000 * 60 * 5;
const waitFiveMinutesAndRetry = async (page, mountain, date, retries, logInInfo, buddy) => {
    await delay(FIVE_MINUTES); // wait five minutes;
    await page.reload({
        waitUntil: ['networkidle0', 'domcontentloaded'],
    });

    await loginUtils.checkSessionExpired(page, logInInfo);
    await runWithRetries(page, mountain, date, retries - 1, logInInfo, buddy);
};

const runWithRetries = async (page, mountain, date, retries, logInInfo, buddy) => {
    try {
        await selectMountainAndCheckDay(page, mountain, date);
        const spotReserved = await tryConfirming(page, mountain, date, retries, buddy);

        if (spotReserved) {
            console.log(`Space reserved for ${date.month} ${date.day} ${date.year}!!`);
            return true;
        } else if (retries > 0) {
            console.log(`date not available - waiting five minutes and retying. Retries left: ${retries}`);
            await waitFiveMinutesAndRetry(page, mountain, date, retries, logInInfo, buddy);
        } else {
            console.log('Exhausted retries');
            return false;
        }
    } catch (e) {
        console.log(e);
        if (retries > 0) {
            console.log(`Waiting five minutes and retying - Retries left: ${retries}`);
            console.log('******************************');
            await waitFiveMinutesAndRetry(page, mountain, date, retries, logInInfo, buddy);
        } else {
            return false;
        }
    }
};

module.exports = runWithRetries;
