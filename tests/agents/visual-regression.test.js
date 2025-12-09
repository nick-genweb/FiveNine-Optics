/**
 * Agent 2: Visual Regression Validator
 * Compares screenshots against reference images to detect visual changes
 */

const fs = require('fs');
const path = require('path');
const PuppeteerHelpers = require('../utils/puppeteer-helpers');
const ScreenshotDiffer = require('../utils/screenshot-differ');
const config = require('../test.config');

describe('Visual Regression Validator', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await global.__BROWSER__;
    page = await browser.newPage();
  });

  afterAll(async () => {
    if (page) await page.close();
  });

  // Test each page at each viewport
  config.pages.forEach((pageConfig) => {
    describe(`${pageConfig.name} Page`, () => {
      Object.entries(config.viewports).forEach(([viewportName, viewportConfig]) => {
        test(`should match reference screenshot at ${viewportConfig.name} (${viewportConfig.width}x${viewportConfig.height})`, async () => {
          // Set viewport
          await PuppeteerHelpers.setViewport(page, viewportName);

          // Navigate to page
          await PuppeteerHelpers.navigateToPage(page, pageConfig.path);
          await PuppeteerHelpers.waitForPageReady(page);

          // Generate screenshot filename
          const filename = ScreenshotDiffer.getScreenshotFilename(
            pageConfig.name,
            viewportName,
            'actual'
          );

          // Take screenshot
          const actualPath = ScreenshotDiffer.getScreenshotPath(filename, 'actual');
          await PuppeteerHelpers.takeScreenshot(page, actualPath);

          // Get reference screenshot path
          const referenceFilename = ScreenshotDiffer.getScreenshotFilename(
            pageConfig.name,
            viewportName,
            'reference'
          );
          const referencePath = ScreenshotDiffer.getScreenshotPath(referenceFilename, 'reference');

          // Check if reference exists
          if (!fs.existsSync(referencePath)) {
            // No reference - this is likely the first run
            console.log(
              `\nNo reference screenshot found for ${pageConfig.name} at ${viewportName}. ` +
                `Run "npm run test:baseline" to generate reference screenshots.\n`
            );

            // Skip this test but don't fail
            return;
          }

          // Compare screenshots
          const diffFilename = `${pageConfig.slug}-${viewportName}-diff.png`;
          const diffPath = ScreenshotDiffer.getScreenshotPath(diffFilename, 'diff');

          const result = ScreenshotDiffer.compare(referencePath, actualPath, diffPath);

          // Generate comparison HTML
          const comparisonPath = path.join(
            __dirname,
            '../reports/visual-diffs',
            `${pageConfig.slug}-${viewportName}-comparison.html`
          );
          ScreenshotDiffer.generateComparisonHTML(result, comparisonPath);

          // Assert
          if (!result.passed) {
            const message = [
              `Visual regression detected on ${pageConfig.name} at ${viewportName}:`,
              `  Difference: ${result.diffPercentage.toFixed(2)}% (threshold: ${result.threshold}%)`,
              `  Different pixels: ${result.diffPixels.toLocaleString()} / ${result.totalPixels.toLocaleString()}`,
              `\nComparison report: ${comparisonPath}`,
              `\nTo update the reference:`,
              `  npm run test:update-reference -- ${pageConfig.slug} ${viewportName}`,
            ].join('\n');

            fail(message);
          }

          expect(result.passed).toBe(true);
          expect(result.diffPercentage).toBeLessThanOrEqual(config.visualRegression.threshold * 100);
        }, 30000); // 30 second timeout per screenshot
      });
    });
  });

  describe('Visual Regression Management', () => {
    test('should have reference screenshots directory', () => {
      const referenceDir = path.join(
        __dirname,
        '../..',
        config.visualRegression.referenceDir
      );
      expect(fs.existsSync(referenceDir)).toBe(true);
    });

    test('should have actual screenshots directory', () => {
      const actualDir = path.join(__dirname, '../..', config.visualRegression.actualDir);
      expect(fs.existsSync(actualDir)).toBe(true);
    });

    test('should have diff screenshots directory', () => {
      const diffDir = path.join(__dirname, '../..', config.visualRegression.diffDir);
      expect(fs.existsSync(diffDir)).toBe(true);
    });
  });
});
