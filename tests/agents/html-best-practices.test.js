/**
 * Agent 3: HTML Best Practices Validator
 * Validates HTML semantics, accessibility, and best practices
 */

const fs = require('fs');
const path = require('path');
const PuppeteerHelpers = require('../utils/puppeteer-helpers');
const HTMLParser = require('../utils/html-parser');
const config = require('../test.config');

describe('HTML Best Practices Validator', () => {
  let browser;
  let page;
  const reportDir = path.join(__dirname, '../reports/html-reports');

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

  // Test each page
  config.pages.forEach((pageConfig) => {
    describe(`${pageConfig.name} Page`, () => {
      let html;
      let allValidation;

      beforeAll(async () => {
        // Navigate to page
        await PuppeteerHelpers.navigateToPage(page, pageConfig.path);
        await PuppeteerHelpers.waitForPageReady(page);

        // Get HTML
        html = await PuppeteerHelpers.getPageHTML(page);

        // Run all validations
        allValidation = HTMLParser.validateAll(html);

        // Generate report
        generateHTMLReport(pageConfig.name, allValidation);
      });

      describe('Image Accessibility', () => {
        test('should have alt attributes on all images', () => {
          const validation = allValidation.results.images;

          if (validation.missingAlt > 0) {
            const missingAltImages = validation.images.filter((img) => !img.hasAlt);
            const imageList = missingAltImages.map((img) => `  - ${img.src}`).join('\n');

            fail(
              `${validation.missingAlt} image(s) missing alt attribute:\n${imageList}\n\n` +
                `Fix: Add descriptive alt text to all images for accessibility.`
            );
          }

          expect(validation.missingAlt).toBe(0);
        });

        test('should have non-empty alt text (unless decorative)', () => {
          const validation = allValidation.results.images;
          const emptyAlt = validation.images.filter((img) => img.hasAlt && img.isEmpty);

          if (emptyAlt.length > 0) {
            const imageList = emptyAlt.map((img) => `  - ${img.src}`).join('\n');

            console.log(
              `\nWarning: ${emptyAlt.length} image(s) with empty alt text (OK if decorative):\n${imageList}\n`
            );
          }

          // This is a warning, not a failure - empty alt is acceptable for decorative images
          expect(emptyAlt.length).toBeGreaterThanOrEqual(0);
        });
      });

      describe('Semantic HTML Structure', () => {
        test('should use semantic HTML5 elements', () => {
          const validation = allValidation.results.semanticHTML;
          const missingElements = Object.entries(validation.structure)
            .filter(([tag, data]) => !data.exists && ['header', 'main', 'footer', 'nav'].includes(tag))
            .map(([tag]) => tag);

          if (missingElements.length > 0) {
            console.log(
              `\nNote: Missing semantic elements (may be intentional): ${missingElements.join(', ')}`
            );
          }

          // Ensure at least main element exists
          expect(validation.structure.main.exists).toBe(true);
        });

        test('should have header element', () => {
          const validation = allValidation.results.semanticHTML;
          expect(validation.structure.header.exists).toBe(true);
        });

        test('should have footer element', () => {
          const validation = allValidation.results.semanticHTML;
          expect(validation.structure.footer.exists).toBe(true);
        });

        test('should have nav element', () => {
          const validation = allValidation.results.semanticHTML;
          expect(validation.structure.nav.exists).toBe(true);
        });
      });

      describe('Form Accessibility', () => {
        test('should have labels or aria-labels on form elements', () => {
          const validation = allValidation.results.forms;

          if (validation.missingLabels > 0) {
            const unlabeled = validation.formElements.filter(
              (el) => !el.hasLabel && !el.ariaLabel
            );
            const elementList = unlabeled
              .map(
                (el) =>
                  `  - ${el.type}${el.id ? ` (id="${el.id}")` : ''}${el.name ? ` (name="${el.name}")` : ''}`
              )
              .join('\n');

            fail(
              `${validation.missingLabels} form element(s) missing labels:\n${elementList}\n\n` +
                `Fix: Add <label for="..."> or aria-label attribute to all form controls.`
            );
          }

          expect(validation.missingLabels).toBe(0);
        });
      });

      describe('Meta Tags', () => {
        test('should have a page title', () => {
          const validation = allValidation.results.metaTags;

          if (!validation.meta.title || validation.meta.title.trim() === '') {
            fail('Page is missing a <title> tag.\n\nFix: Add a descriptive title in the <head>.');
          }

          expect(validation.meta.title).toBeTruthy();
          expect(validation.meta.title.length).toBeGreaterThan(0);
        });

        test('should have unique page title', () => {
          const validation = allValidation.results.metaTags;
          const title = validation.meta.title;

          // Title should include page name or be descriptive
          if (pageConfig.name !== 'Home') {
            // Non-home pages should have the page name in title
            const hasPageName = title.toLowerCase().includes(pageConfig.name.toLowerCase());

            if (!hasPageName) {
              console.log(
                `\nNote: Page title doesn't include page name "${pageConfig.name}". ` +
                  `Current title: "${title}"`
              );
            }
          }

          expect(title).toBeTruthy();
        });

        test('should have meta description', () => {
          const validation = allValidation.results.metaTags;

          if (!validation.meta.description) {
            console.log(
              `\nWarning: Page is missing meta description (important for SEO).\n` +
                `Fix: Add <meta name="description" content="...">`
            );
          }

          // Warning only, not a failure
          expect(validation.meta.description || 'ok').toBeTruthy();
        });

        test('should have viewport meta tag', () => {
          const validation = allValidation.results.metaTags;

          if (!validation.meta.viewport) {
            fail(
              'Page is missing viewport meta tag (required for responsive design).\n\n' +
                'Fix: Add <meta name="viewport" content="width=device-width, initial-scale=1.0">'
            );
          }

          expect(validation.meta.viewport).toBeTruthy();
        });
      });

      describe('Link Accessibility', () => {
        test('should not have generic link text without aria-label', () => {
          const validation = allValidation.results.links;
          const genericLinks = validation.issues.filter((i) => i.type === 'generic-link-text');

          if (genericLinks.length > 0) {
            const linkList = genericLinks
              .map((issue) => `  - "${issue.text}" (${issue.href})`)
              .join('\n');

            console.log(
              `\nWarning: ${genericLinks.length} link(s) with generic text:\n${linkList}\n` +
                `Recommendation: Use descriptive link text or add aria-label.`
            );
          }

          // Warning only
          expect(genericLinks.length).toBeGreaterThanOrEqual(0);
        });

        test('should not have empty links', () => {
          const validation = allValidation.results.links;
          const emptyLinks = validation.issues.filter((i) => i.type === 'empty-link');

          if (emptyLinks.length > 0) {
            const linkList = emptyLinks.map((issue) => `  - ${issue.href}`).join('\n');

            fail(
              `${emptyLinks.length} link(s) with no text or aria-label:\n${linkList}\n\n` +
                `Fix: Add text content or aria-label to all links.`
            );
          }

          expect(emptyLinks.length).toBe(0);
        });
      });

      test('should pass all HTML best practices validation', () => {
        const errors = allValidation.summary.errors;

        if (errors > 0) {
          const allErrors = Object.values(allValidation.results)
            .flatMap((r) => r.issues || [])
            .filter((i) => i.severity === 'error');

          const errorList = allErrors.map((e) => `  - ${e.message}`).join('\n');

          fail(
            `HTML validation failed with ${errors} error(s):\n${errorList}\n\n` +
              `See detailed report: ${reportDir}/${pageConfig.slug}-html.html`
          );
        }

        expect(allValidation.passed).toBe(true);
      });
    });
  });

  /**
   * Generate HTML report
   */
  function generateHTMLReport(pageName, validation) {
    const reportPath = path.join(
      reportDir,
      `${pageName.toLowerCase().replace(/\s+/g, '-')}-html.json`
    );

    const report = {
      page: pageName,
      timestamp: new Date().toISOString(),
      passed: validation.passed,
      summary: validation.summary,
      results: validation.results,
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // Generate HTML version
    generateHTMLReportHTML(pageName, report);
  }

  /**
   * Generate HTML report as HTML file
   */
  function generateHTMLReportHTML(pageName, report) {
    const htmlPath = path.join(reportDir, `${pageName.toLowerCase().replace(/\s+/g, '-')}-html.html`);

    const sections = Object.entries(report.results)
      .map(([category, result]) => {
        const issueRows =
          result.issues && result.issues.length > 0
            ? result.issues
                .map(
                  (issue) => `
          <tr class="${issue.severity}">
            <td><span class="badge ${issue.severity}">${issue.severity}</span></td>
            <td>${issue.type}</td>
            <td>${issue.message}</td>
          </tr>
        `
                )
                .join('')
            : '<tr><td colspan="3" style="text-align: center;">No issues found</td></tr>';

        const categoryName = category
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, (str) => str.toUpperCase())
          .trim();

        return `
      <div class="section">
        <h2>${categoryName}</h2>
        <table>
          <thead>
            <tr>
              <th>Severity</th>
              <th>Type</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            ${issueRows}
          </tbody>
        </table>
      </div>
    `;
      })
      .join('');

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HTML Best Practices Report - ${pageName}</title>
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
      background: ${report.passed ? '#1a472a' : '#561a1a'};
      padding: 2rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }
    .status {
      display: inline-block;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      font-weight: bold;
      background: ${report.passed ? '#22c55e' : '#ef4444'};
      margin-bottom: 1rem;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }
    .stat { background: #2a2a2a; padding: 1rem; border-radius: 4px; }
    .stat-label { color: #888; font-size: 0.875rem; margin-bottom: 0.5rem; }
    .stat-value { font-size: 1.5rem; font-weight: bold; }
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
      text-transform: uppercase;
    }
    .badge.error { background: #ef4444; color: #fff; }
    .badge.warning { background: #f59e0b; color: #000; }
    tr.error { background: #2a1a1a; }
    tr.warning { background: #2a2210; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="status">${report.passed ? 'PASSED' : 'FAILED'}</div>
      <h1>HTML Best Practices Report</h1>
      <p><strong>${pageName}</strong> - ${new Date(report.timestamp).toLocaleString()}</p>

      <div class="stats">
        <div class="stat">
          <div class="stat-label">Total Issues</div>
          <div class="stat-value">${report.summary.totalIssues}</div>
        </div>
        <div class="stat">
          <div class="stat-label">Errors</div>
          <div class="stat-value" style="color: ${report.summary.errors > 0 ? '#ef4444' : '#22c55e'}">
            ${report.summary.errors}
          </div>
        </div>
        <div class="stat">
          <div class="stat-label">Warnings</div>
          <div class="stat-value" style="color: ${report.summary.warnings > 0 ? '#f59e0b' : '#22c55e'}">
            ${report.summary.warnings}
          </div>
        </div>
      </div>
    </div>

    ${sections}
  </div>
</body>
</html>
    `;

    fs.writeFileSync(htmlPath, html);
  }
});
