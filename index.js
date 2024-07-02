const { chromium } = require('playwright');
const logTest = require('./utils/logger.js');
// Set this to true when running test in tests/articles.spec.js file
let testing = false;

async function saveHackerNewsArticles(page) {
  // launch browser
  // if statement to check if there is already a page from being ran inside a test
  // See tests/articles.spec.js file
  if (!page) {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    page = await context.newPage();
  }

  // go to Hacker News
  await page.goto('https://news.ycombinator.com/newest');

  //Array to collect timestamp strings
  let times = [];

  // Loop until 100 articles are collected
  while (times.length < 100) {
    /* 
      Following best practices listed here:
      https://playwright.dev/docs/best-practices

      Only test user-visible data

      This grabs all of the article timestamp string:
      Ex: '1 minute ago'
    */
    const articleTimes = await page.locator('.age').allTextContents();

    // allTextContents return an array so concat them onto the times array
    times = times.concat(articleTimes);

    // Click to the next page of articles with a second delay, for testing file
    await page.locator('.morelink').click({
      delay: 1000,
    });
  }

  // Return the first 100 timestamps
  return times.slice(0, 100);
}

function isNewestToOldest(timeArr) {
  // Loop through the array
  for (let i = 0; i < timeArr.length; i++) {
    // Only run if the next index exist
    if (timeArr[i + 1]) {
      // Extract and store the time from current and next string
      const [num1, num2] = [
        parseInt(timeArr[i].slice(0, 2)),
        parseInt(timeArr[i + 1].slice(0, 2)),
      ];
      // Extract and store the time unit from current and next string
      const [unit1, unit2] = [
        timeArr[i].slice(2).trim(),
        timeArr[i + 1].slice(2).trim(),
      ];

      // If an hour unit come before a minute unit, it is NOT newest to oldest
      if (unit1[0] === 'h' && unit2[0] === 'm') {
        return false;
      } else if (
        // Check if both current and next index have the same time unit
        (unit1[0] === 'm' && unit2[0] === 'm') ||
        (unit1[0] === 'h' && unit2[0] === 'h')
      ) {
        // If so, check if first num is larger than the next.
        // If so, the arr is NOT newest to oldest
        if (num1 > num2) {
          return false;
        }
      }
    }
  }

  // Otherwise, return true
  return true;
}

(async () => {
  if (!testing) {
    // Store the timestamps returned from the function
    const articleDates = await saveHackerNewsArticles();

    // Test Failure input. This input shuould fail the test
    // const oldestToNewestTest = ['1 hour ago', '38 minutes ago'];

    // // Run the validator on the times and store the result
    const isValidated = isNewestToOldest(articleDates);

    // // Log the result
    logTest(isValidated);

    // Exit Node process
    process.exit();
  }
})();

module.exports = {
  saveHackerNewsArticles,
  isNewestToOldest,
};
