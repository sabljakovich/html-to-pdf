const express = require('express')
const bodyParser = require('body-parser')
const puppeteer = require('puppeteer')

const PORT = +process.env.PORT || 1234;
const app = express()
const logger = console

let browser;

app.use(bodyParser.text({ type: 'text/html', limit: '100mb' }))

//https://github.com/puppeteer/puppeteer/issues/1793#issuecomment-438971272
const run = async () => {

    browser = await puppeteer.launch({
        headless: true,
        executablePath: '/usr/bin/chromium-browser',
        args: [
            "--no-sandbox",
            "--disable-gpu",
            '--disable-dev-shm-usage',
            '--headless'
        ]
    });

    app.listen(PORT, () => {
        logger.debug(`${new Date()} - PDF renderer running on port ${PORT}`)
    });
};

run().then()


app.get('/renderer/memory', async (req, res) => {

    const used = process.memoryUsage();
    const memory = {}

    for (let key in used) {
        memory[key] = Math.round(used[key] / 1024 / 1024 * 100) / 100;
    }

    res.status(200)
    res.send({ memory })
})

app.post('/renderer/html-to-pdf', async (req, res) => {

    logger.info(`${new Date() } - Generating a new pdf`)

    const beginTimer = new Date();

    try {
        const page = await browser.newPage();

        await page.setContent(req.body);
        await page.emulateMedia('screen');
        page.setDefaultNavigationTimeout(0)

        const pdf = await page.pdf({ format: 'A4', printBackground: true });
        await page.close();

        res.set('Content-Type', 'application/pdf');
        res.send(pdf)

        logger.info(`${new Date()} - Successfully generated new pdf in ${new Date() - beginTimer} milliseconds`);

    } catch (e) {

        logger.error(`${new Date()} - Failed to pdf in ${new Date() - beginTimer }`, e);

        res.status(500)
        res.send({
            errorType: 'FailedToGeneratePDF',
            errorMessage: e.message
        })
    }
});



