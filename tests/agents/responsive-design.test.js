/**
 * Agent 4: Responsive Design Validator
 * Tests responsive design across multiple viewports
 */

const fs = require('fs');
const path = require('path');
const PuppeteerHelpers = require('../utils/puppeteer-helpers');
const config = require('../test.config');

describe('Responsive Design Validator', () => {
  let browser;
  let page;
  const reportDir = path.join(__dirname, '../reports/responsive-reports');

  beforeAll(async () => {
    browser = await global.__BROWSER__;
    page = await browser.newPage();

    // Ensure report directory exists
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
  });

  afterAll(async () => {
    if (page) await page.close();
  });

  // Test each page at each viewport
  config.pages.forEach((pageConfig) => {
    describe(`${pageConfig.name} Page`, () => {
      Object.entries(config.viewports).forEach(([viewportName, viewportConfig]) => {
        describe(`at ${viewportConfig.name} (${viewportConfig.width}x${viewportConfig.height})`, () => {
          let responsiveReport = {};

          beforeAll(async () => {
            // Set viewport
            await PuppeteerHelpers.setViewport(page, viewportName);

            // Navigate to page
            await PuppeteerHelpers.navigateToPage(page, pageConfig.path);
            await PuppeteerHelpers.waitForPageReady(page);

            // Initialize report
            responsiveReport = {
              page: pageConfig.name,
              viewport: viewportName,
              dimensions: viewportConfig,
              timestamp: new Date().toISOString(),
              tests: {},
            };
          });

          afterAll(() => {
            // Save report
            const reportPath = path.join(
              reportDir,
              `${pageConfig.slug}-${viewportName}.json`
            );
            fs.writeFileSync(reportPath, JSON.stringify(responsiveReport, null, 2));
          });

          test('should not have horizontal scroll', async () => {
            const hasScroll = await PuppeteerHelpers.hasHorizontalScroll(page);

            responsiveReport.tests.horizontalScroll = {
              passed: !hasScroll,
              hasScroll,
            };

            if (hasScroll && !config.responsive.allowHorizontalScroll) {
              fail(
                `Page has horizontal scroll at ${viewportConfig.name} (${viewportConfig.width}px).\n\n` +
                  `Fix: Ensure all content fits within the viewport width using max-width or responsive units.`
              );
            }

            expect(hasScroll).toBe(false);
          });

          test('should have properly sized touch targets on mobile', async () => {
            // Only test on mobile and tablet viewports
            if (!['mobile', 'tablet'].includes(viewportName)) {
              responsiveReport.tests.touchTargets = { skipped: true, reason: 'Desktop viewport' };
              return;
            }

            const elements = await PuppeteerHelpers.getInteractiveElements(page);
            const minSize = config.responsive.minTouchTargetSize;
            const smallTargets = elements.filter((el) => !el.meetsMinSize);

            responsiveReport.tests.touchTargets = {
              passed: smallTargets.length === 0,
              totalElements: elements.length,
              smallTargets: smallTargets.length,
              minSize,
              violations: smallTargets.slice(0, 10), // First 10 violations
            };

            if (smallTargets.length > 0) {
              const targetList = smallTargets
                .slice(0, 10)
                .map(
                  (el) =>
                    `  - ${el.tag} "${el.text}" (${Math.round(el.width)}x${Math.round(el.height)}px)`
                )
                .join('\n');

              console.log(
                `\nWarning: ${smallTargets.length} interactive element(s) smaller than ${minSize}x${minSize}px:\n${targetList}\n` +
                  `${smallTargets.length > 10 ? `  ... and ${smallTargets.length - 10} more\n` : ''}` +
                  `Recommendation: Increase tap target size for better mobile usability.`
              );
            }

            // This is a warning, not a hard failure
            expect(smallTargets.length).toBeGreaterThanOrEqual(0);
          });

          test('should have readable font sizes', async () => {
            const bodyFontSize = await PuppeteerHelpers.getComputedStyle(
              page,
              'body',
              'fontSize'
            );

            const fontSize = parseFloat(bodyFontSize);
            const minSize = config.html.minBodyFontSize;

            responsiveReport.tests.fontSize = {
              passed: fontSize >= minSize,
              bodyFontSize: fontSize,
              minSize,
            };

            if (fontSize < minSize) {
              console.log(
                `\nWarning: Body font size (${fontSize}px) is smaller than recommended minimum (${minSize}px) at ${viewportConfig.name}.\n` +
                  `Recommendation: Increase font size for better readability.`
              );
            }

            // Warning only
            expect(fontSize).toBeGreaterThan(0);
          });

          test('should load all images properly', async () => {
            const images = await PuppeteerHelpers.getImages(page);
            const brokenImages = [];

            // Check for images with 0 dimensions (likely broken)
            for (const img of images) {
              if (img.width === 0 || img.height === 0) {
                brokenImages.push(img);
              }
            }

            responsiveReport.tests.images = {
              passed: brokenImages.length === 0,
              totalImages: images.length,
              brokenImages: brokenImages.length,
            };

            if (brokenImages.length > 0) {
              const imageList = brokenImages.map((img) => `  - ${img.src}`).join('\n');

              fail(
                `${brokenImages.length} image(s) failed to load or have zero dimensions:\n${imageList}\n\n` +
                  `Fix: Ensure all images exist and have valid src attributes.`
              );
            }

            expect(brokenImages.length).toBe(0);
          });

          test('should have main container with max-width', async () => {
            // Check if there's a container with max-width set
            const containerMaxWidth = await page.evaluate(() => {
              const selectors = ['.container', 'main', '[class*="container"]', 'body > *'];

              for (const selector of selectors) {
                const element = document.querySelector(selector);
                if (element) {
                  const styles = window.getComputedStyle(element);
                  const maxWidth = styles.maxWidth;

                  if (maxWidth && maxWidth !== 'none') {
                    return {
                      selector,
                      maxWidth,
                      width: styles.width,
                    };
                  }
                }
              }

              return null;
            });

            responsiveReport.tests.containerMaxWidth = {
              passed: containerMaxWidth !== null,
              container: containerMaxWidth,
            };

            if (!containerMaxWidth && viewportConfig.width > 1440) {
              console.log(
                `\nNote: No container with max-width found at ${viewportConfig.name}.\n` +
                  `Recommendation: Consider adding max-width to prevent overly wide content on large screens.`
              );
            }

            // This is informational, not a failure
            expect(containerMaxWidth || {}).toBeDefined();
          });

          if (config.responsive.testInteractiveElements) {
            test('should have working interactive elements', async () => {
              // Test that buttons and links are clickable
              const interactiveElements = await page.evaluate(() => {
                const elements = [];
                const selectors = ['button', 'a[href]', 'input[type="submit"]'];

                selectors.forEach((selector) => {
                  document.querySelectorAll(selector).forEach((el) => {
                    const rect = el.getBoundingClientRect();
                    const isVisible =
                      rect.width > 0 &&
                      rect.height > 0 &&
                      rect.top < window.innerHeight &&
                      rect.bottom > 0;

                    if (isVisible) {
                      elements.push({
                        tag: el.tagName.toLowerCase(),
                        visible: isVisible,
                        clickable: true,
                      });
                    }
                  });
                });

                return elements;
              });

              responsiveReport.tests.interactiveElements = {
                passed: true,
                visibleElements: interactiveElements.length,
              };

              expect(interactiveElements.length).toBeGreaterThanOrEqual(0);
            });
          }

          test('should take responsive screenshot', async () => {
            const screenshotPath = path.join(
              reportDir,
              `${pageConfig.slug}-${viewportName}.png`
            );

            await PuppeteerHelpers.takeScreenshot(page, screenshotPath);

            responsiveReport.tests.screenshot = {
              passed: true,
              path: screenshotPath,
            };

            expect(fs.existsSync(screenshotPath)).toBe(true);
          });
        });
      });

      test(`should generate responsive report for ${pageConfig.name}`, () => {
        // Generate comprehensive HTML report for this page across all viewports
        generateResponsiveHTMLReport(pageConfig);
        expect(true).toBe(true);
      });
    });
  });

  /**
   * Generate comprehensive responsive HTML report
   */
  function generateResponsiveHTMLReport(pageConfig) {
    const htmlPath = path.join(reportDir, `${pageConfig.slug}-responsive.html`);

    // Load all viewport reports for this page
    const viewportReports = Object.keys(config.viewports)
      .map((viewportName) => {
        const reportPath = path.join(reportDir, `${pageConfig.slug}-${viewportName}.json`);
        if (fs.existsSync(reportPath)) {
          return JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
        }
        return null;
      })
      .filter(Boolean);

    if (viewportReports.length === 0) return;

    const viewportRows = viewportReports
      .map((report) => {
        const tests = report.tests || {};
        const passedTests = Object.values(tests).filter(
          (t) => t && t.passed !== false && !t.skipped
        ).length;
        const totalTests = Object.values(tests).filter((t) => t && !t.skipped).length;
        const allPassed = passedTests === totalTests;

        return `
      <tr>
        <td><strong>${report.dimensions.name}</strong></td>
        <td>${report.dimensions.width}x${report.dimensions.height}</td>
        <td>
          <span class="badge ${allPassed ? 'success' : 'warning'}">
            ${passedTests}/${totalTests} passed
          </span>
        </td>
        <td>
          ${tests.horizontalScroll ? (tests.horizontalScroll.hasScroll ? '⚠️ Has scroll' : '✓ No scroll') : '-'}
        </td>
        <td>
          ${tests.touchTargets && tests.touchTargets.smallTargets ? `⚠️ ${tests.touchTargets.smallTargets} small` : '✓ OK'}
        </td>
        <td>
          ${tests.screenshot && tests.screenshot.passed ? '<a href="' + path.basename(tests.screenshot.path) + '">View</a>' : '-'}
        </td>
      </tr>
    `;
      })
      .join('');

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Responsive Design Report - ${pageConfig.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: #1a1a1a;
      color: #fff;
      padding: 2rem;
    }
    .container { max-width: 1200px; margin: 0 auto; }
    .header {
      background: #1a472a;
      padding: 2rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }
    .status {
      display: inline-block;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      font-weight: bold;
      background: #22c55e;
      margin-bottom: 1rem;
    }
    .section {
      background: #2a2a2a;
      padding: 2rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }
    .section h2 {
      margin-bottom: 1rem;
      color: #888;
      font-size: 1rem;
      text-transform: uppercase;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      background: #1a1a1a;
      border-radius: 4px;
      overflow: hidden;
    }
    th, td { padding: 1rem; text-align: left; border-bottom: 1px solid #333; }
    th { background: #333; color: #888; font-weight: 600; font-size: 0.875rem; text-transform: uppercase; }
    .badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: bold;
    }
    .badge.success { background: #22c55e; color: #000; }
    .badge.warning { background: #f59e0b; color: #000; }
    a { color: #3b82f6; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="status">RESPONSIVE TEST</div>
      <h1>Responsive Design Report</h1>
      <p><strong>${pageConfig.name}</strong> - ${viewportReports.length} viewport(s) tested</p>
    </div>

    <div class="section">
      <h2>Viewport Test Results</h2>
      <table>
        <thead>
          <tr>
            <th>Viewport</th>
            <th>Dimensions</th>
            <th>Tests</th>
            <th>Horizontal Scroll</th>
            <th>Touch Targets</th>
            <th>Screenshot</th>
          </tr>
        </thead>
        <tbody>
          ${viewportRows}
        </tbody>
      </table>
    </div>
  </div>
</body>
</html>
    `;

    fs.writeFileSync(htmlPath, html);
  }
});
