/**
 * Jest setup file - runs before all tests
 */

const fs = require('fs');
const path = require('path');

// Ensure required directories exist
const dirs = [
  'tests/reports',
  'tests/reports/visual-diffs',
  'tests/reports/actual-screenshots',
  'tests/reports/seo-reports',
  'tests/reports/html-reports',
  'tests/reports/responsive-reports',
];

dirs.forEach((dir) => {
  const fullPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// Extend Jest timeout for Puppeteer operations
jest.setTimeout(60000);

// Global test utilities
global.sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

global.waitForElement = async (page, selector, timeout = 10000) => {
  try {
    await page.waitForSelector(selector, { timeout });
    return true;
  } catch (error) {
    return false;
  }
};

global.getComputedStyle = async (page, selector, property) => {
  return await page.evaluate(
    (sel, prop) => {
      const element = document.querySelector(sel);
      if (!element) return null;
      return window.getComputedStyle(element)[prop];
    },
    selector,
    property
  );
};

console.log('FiveNine Optics Test Suite Initialized');
