const puppeteer = require('puppeteer');
const chromeLauncher = require('chrome-launcher');
const util = require('util');
const request = require('request');

const setupChrome = async headless => {
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
    return browser;
};

module.exports = setupChrome;
