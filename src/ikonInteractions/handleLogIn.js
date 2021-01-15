const logInToIkon = async (page) => {
    // navigate to ikon
    await page.goto('https://account.ikonpass.com/en/login', {
        waitUntil: 'domcontentloaded',
        timeout: 180000, //180 seconds
    });

    console.log('logging in');
    const emailInput = await page.$('#email');
    await emailInput.type('');
    const passwordInput = await page.$('#sign-in-password');
    await passwordInput.type('');
    // console.log(passwordInput, "passwordInput");

    const submitBtn = await page.$('.submit');

    await Promise.all([
        page.waitForNavigation({
            waitUntil: ['networkidle0', 'domcontentloaded'],
        }),
        submitBtn.click(),
    ]);
};

const checkSessionExpired = async (page) => {
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
}

module.exports = {checkSessionExpired, logInToIkon};