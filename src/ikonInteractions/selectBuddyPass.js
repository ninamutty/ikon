const delay = require('../utils/delay');

const selectBuddyPass = async (page) => {
    console.log('selecting buddy pass');
    const yesLabel = await page.$x(`//span[contains(., 'Yes')]`);
    const parentElement = (await yesLabel[0].$x('..'))[0];
    await parentElement.click();

    await delay(300);
};

module.exports = selectBuddyPass;