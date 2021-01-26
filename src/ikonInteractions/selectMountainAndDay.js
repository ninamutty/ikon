const chooseMountainToReserve = require('./mountainSelect');
const dateSelect = require('./dateSelect');
const delay = require('../utils/delay');

const selectMountainAndCheckDay = async (page, mountain, date) => {
    await chooseMountainToReserve(page, mountain);

    await delay(500);
    await dateSelect.findMonth(page, date);

    await dateSelect.selectDay(page, date);
    await delay(500);
};

module.exports = selectMountainAndCheckDay;
