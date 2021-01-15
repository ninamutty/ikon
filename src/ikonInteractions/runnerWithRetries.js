const loginUtils = require('./handleLogin');
const selectMountainAndCheckDay = require('./selectMountainAndDay');
const tryConfirming = require('./tryConfirming');
const delay = require('../utils/delay');

const FIVE_MINUTES = 1000 * 60 * 5;
const waitFiveMinutesAndRetry = async (page, mountain, month, day, year, retries) => {
    await delay(FIVE_MINUTES); // wait five minutes;
    await page.reload({
        waitUntil: ['networkidle0', 'domcontentloaded'],
    });

    await loginUtils.checkSessionExpired(page);
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
            console.log('******************************');
            await waitFiveMinutesAndRetry(page, mountain, month, day, year, retries);
        } else {
            return false;
        }
    }
};

module.exports = runWithRetries;
