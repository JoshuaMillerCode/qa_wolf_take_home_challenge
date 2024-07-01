// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require('playwright');
const logTest = require('./utils/logger.js');

async function saveHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  page = await context.newPage();

  // go to Hacker News
  await page.goto('https://news.ycombinator.com/newest');
  // Array to hold all the UTC dates
  let articleDates = [];

  pageLoop: while (articleDates.length < 100) {
    // Collect all of the elements that hold the article's UTC publish date
    const articleAges = await page.locator('.age').all();

    // Loop over the elements to get their title attribute which holds the UTC date
    for (let i = 0; i < articleAges.length; i++) {
      const date = await articleAges[i].getAttribute('title');
      articleDates.push(date);
      // Once it collects 100 dates, close the page and stop the loop by continuing the outer loop
      if (articleDates.length >= 100) {
        await page.close();
        continue pageLoop;
      }
    }

    // Click to the next page of articles
    await page.locator('.morelink').click();
  }

  return articleDates;
}

// Validator Function
function isNewestToOldest(arr) {
  // Loop over array
  for (let i = 0; i < arr.length; i++) {
    // Store the next element
    let nextIdx = arr[i + 1];
    //Check if next index exist
    if (nextIdx) {
      /*
        Check is current date is older than the next. 
        If it is, return false
      */
      if (arr[i] < nextIdx) {
        return false;
      }
    }
  }

  // Otherwise return true
  return true;
}

(async () => {
  // Store the dates returned from the function
  const articleDates = await saveHackerNewsArticles();

  // Test Failure input. This input shuould fail the test
  // const oldestToNewestTest = ['2024-06-28T19:38:53', '2024-06-28T19:39:44'];

  // Run the validator on the dates and store the result
  const isValidated = isNewestToOldest(articleDates);

  // Log the result
  logTest(isValidated);

  // Exit Node process
  process.exit();
})();

module.exports = {
  saveHackerNewsArticles,
  isNewestToOldest,
};
