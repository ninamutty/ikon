const delay = require('../utils/delay');

const findMonth = async (page, date) => {
    const monthElem = await page.$x(`//span[contains(., '${date.month} ${date.year}')]`);

    if (!(monthElem.length > 0)) {
        console.log('Moving to next month');
        const nextBtn = await page.$('.icon-chevron-right');
        (await nextBtn) && nextBtn.click();

        await delay(1000);
        return findMonth(page, date);
    }
    return true;
};

const selectDay = async (page, date) => {
    console.log('Finding the correct day');
    const dayPickerDays = await page.$$('.DayPicker-Day');

    for (let i = 0; i < dayPickerDays.length; i++) {
        const temp = await dayPickerDays[i].$eval('div', e => e.innerText);
        if (temp === date.day) {
            dayPickerDays[i].click();
        }
    }
};

module.exports = { selectDay, findMonth };
