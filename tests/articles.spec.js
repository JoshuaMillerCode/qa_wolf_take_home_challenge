import { test, expect } from '@playwright/test';
import { saveHackerNewsArticles, isNewestToOldest } from '../index.js';

/* 
  Extra Credit: Attempting to run test with the functions built in index.js

  Had to modify the the playwright.config.js file to not run the tests parallel 
  and to only test on chromium.


  HackerNews can't process the requests fast enough. 
  Im very eager to learn how to slow the test down to accomodate for this.


  **> IMPORTANT: Make sure to set the testing variable to true in the index.js file before running the test! <**
*/

test('page has articles', async ({ page }) => {
  const articleDates = await saveHackerNewsArticles(page);

  expect(articleDates).toBeInstanceOf(Array);

  expect(articleDates).toHaveLength(100);
});

test('first 100 articles are newest to oldest', async ({ page }) => {
  const articleDates = await saveHackerNewsArticles(page);

  const isValid = isNewestToOldest(articleDates);

  expect(isValid).toBe(true);
});
