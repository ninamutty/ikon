const chooseMountainToReserve = require('./mountainSelect');
const dateSelect = require('./dateSelect');
const delay = require('../utils/delay');

const selectMountainAndCheckDay = async (page, mountain, month, day, year) => {
    await chooseMountainToReserve(page, mountain);

    await delay(500);
    await dateSelect.findMonth(page, month, year);

    await dateSelect.selectDay(page, day);
    await delay(500);
};

module.exports = selectMountainAndCheckDay;
