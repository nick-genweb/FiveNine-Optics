/**
 * Generate Baseline Reference Screenshots
 * Creates reference screenshots for visual regression testing
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const PuppeteerHelpers = require('./puppeteer-helpers');
const ScreenshotDiffer = require('./screenshot-differ');
const config = require('../test.config');

async function generateBaseline() {
  console.log('\n' + '='.repeat(60));
  console.log('Generating Baseline Reference Screenshots');
  console.log('='.repeat(60) + '\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  let totalScreenshots = 0;

  // Ensure reference directory exists
  const referenceDir = path.join(__dirname, '../..', config.visualRegression.referenceDir);
  if (!fs.existsSync(referenceDir)) {
    fs.mkdirSync(referenceDir, { recursive: true });
  }

  try {
    // For each page
    for (const pageConfig of config.pages) {
      console.log(`\n📄 ${pageConfig.name} Page`);

      // For each viewport
      for (const [viewportName, viewportConfig] of Object.entries(config.viewports)) {
        // Set viewport
        await PuppeteerHelpers.setViewport(page, viewportName);

        // Navigate to page
        await PuppeteerHelpers.navigateToPage(page, pageConfig.path);
        await PuppeteerHelpers.waitForPageReady(page);

        // Generate filename
        const filename = ScreenshotDiffer.getScreenshotFilename(
          pageConfig.name,
          viewportName,
          'reference'
        );
        const screenshotPath = ScreenshotDiffer.getScreenshotPath(filename, 'reference');

        // Take screenshot
        await PuppeteerHelpers.takeScreenshot(page, screenshotPath);

        console.log(
          `  ✓ ${viewportConfig.name} (${viewportConfig.width}x${viewportConfig.height})`
        );
        totalScreenshots++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`✓ Successfully generated ${totalScreenshots} reference screenshots`);
    console.log(`📁 Saved to: ${referenceDir}`);
    console.log('='.repeat(60) + '\n');

    console.log('You can now run visual regression tests with:');
    console.log('  npm test -- visual-regression\n');
  } catch (error) {
    console.error('Error generating baseline:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Run if executed directly
if (require.main === module) {
  generateBaseline();
}

module.exports = generateBaseline;
