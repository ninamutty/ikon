const delay = require('../utils/delay');

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

module.exports = chooseMountainToReserve;
