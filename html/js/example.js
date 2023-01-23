const puppeteer = require('puppeteer');

function GlobalLogger(message) {
    console.log(message)
}

(async () => {
  const browser = await puppeteer.launch({
  ignoreHTTPSErrors: true,
  dumpio: false
  });
  function logger(message) {
      console.log(message)
  }
  const page = await browser.newPage()
  logger("Starting...")
  await page.goto('https://localhost:9443/app/setup.html', {waitUntil: 'domcontentloaded'})
  await page
      .waitForSelector('#element_execute')
      .then(() => {
        logger('Initialized:');
        page.click('#element_execute');
      })

  await page
      .waitForSelector('#sequence_Complete', {
          timeout: 240000
      })
      .then(() => {
        logger('Complete:');

      })
  await browser.close()
})();
