/**
 * Agent 1: SEO Heading Hierarchy Validator
 * Validates heading structure for SEO best practices
 */

const fs = require('fs');
const path = require('path');
const PuppeteerHelpers = require('../utils/puppeteer-helpers');
const HTMLParser = require('../utils/html-parser');
const config = require('../test.config');

describe('SEO Heading Hierarchy Validator', () => {
  let browser;
  let page;
  const reportDir = path.join(__dirname, '../reports/seo-reports');

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
      let validation;

      beforeAll(async () => {
        // Navigate to page
        await PuppeteerHelpers.navigateToPage(page, pageConfig.path);
        await PuppeteerHelpers.waitForPageReady(page);

        // Get HTML
        html = await PuppeteerHelpers.getPageHTML(page);

        // Validate heading hierarchy
        validation = HTMLParser.validateHeadingHierarchy(html);

        // Generate report
        generateSEOReport(pageConfig.name, validation);
      });

      test('should have exactly one H1 heading', () => {
        expect(validation.h1Count).toBe(1);

        if (validation.h1Count === 0) {
          const h1Issue = validation.issues.find((i) => i.type === 'missing-h1');
          if (h1Issue) {
            fail(`${h1Issue.message}\n\nSuggestion: Add an H1 heading to describe the main content of the page.`);
          }
        } else if (validation.h1Count > 1) {
          const h1Headings = validation.headings.filter((h) => h.level === 1);
          fail(
            `Page has ${validation.h1Count} H1 headings (should have exactly one):\n${h1Headings.map((h) => `  - "${h.text}"`).join('\n')}`
          );
        }
      });

      test('should not skip heading levels', () => {
        const skippedLevelIssues = validation.issues.filter((i) => i.type === 'skipped-level');

        if (skippedLevelIssues.length > 0) {
          const issueList = skippedLevelIssues
            .map(
              (issue) =>
                `  - ${issue.from.tag.toUpperCase()} ("${issue.from.text}") → ${issue.to.tag.toUpperCase()} ("${issue.to.text}")`
            )
            .join('\n');

          fail(
            `Heading hierarchy skips levels (bad for SEO and accessibility):\n${issueList}\n\nFix: Adjust heading levels to be sequential (h2 → h3, not h2 → h4)`
          );
        }

        expect(skippedLevelIssues.length).toBe(0);
      });

      test('should not use headings for decorative text', () => {
        const decorativeIssues = validation.issues.filter((i) => i.type === 'decorative-heading');

        if (decorativeIssues.length > 0) {
          const issueList = decorativeIssues
            .map((issue) => `  - ${issue.selector}: "${issue.text}"`)
            .join('\n');

          fail(
            `Decorative text is using heading tags:\n${issueList}\n\nFix: Use <div> or <span> with appropriate CSS classes instead of heading tags for visual styling.`
          );
        }

        expect(decorativeIssues.length).toBe(0);
      });

      test('should have meaningful heading hierarchy', () => {
        const tree = HTMLParser.generateHeadingTree(validation.headings);

        // Check that we have some headings
        expect(validation.headings.length).toBeGreaterThan(0);

        // Log heading tree for visibility
        if (validation.headings.length > 0) {
          console.log(`\n${pageConfig.name} Heading Hierarchy:\n${tree}`);
        }
      });

      test('should pass all SEO heading validation rules', () => {
        const errors = validation.issues.filter((i) => i.severity === 'error');

        if (errors.length > 0) {
          const errorList = errors.map((e) => `  - ${e.message}`).join('\n');
          fail(`SEO validation failed with ${errors.length} error(s):\n${errorList}`);
        }

        expect(validation.passed).toBe(true);
      });
    });
  });

  /**
   * Generate SEO report for a page
   */
  function generateSEOReport(pageName, validation) {
    const reportPath = path.join(reportDir, `${pageName.toLowerCase().replace(/\s+/g, '-')}-seo.json`);

    const report = {
      page: pageName,
      timestamp: new Date().toISOString(),
      passed: validation.passed,
      h1Count: validation.h1Count,
      totalHeadings: validation.headings.length,
      headings: validation.headings,
      issues: validation.issues,
      headingTree: HTMLParser.generateHeadingTree(validation.headings),
      summary: {
        errors: validation.issues.filter((i) => i.severity === 'error').length,
        warnings: validation.issues.filter((i) => i.severity === 'warning').length,
      },
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // Also generate HTML report
    generateSEOHTMLReport(pageName, report);
  }

  /**
   * Generate HTML report for SEO validation
   */
  function generateSEOHTMLReport(pageName, report) {
    const htmlPath = path.join(reportDir, `${pageName.toLowerCase().replace(/\s+/g, '-')}-seo.html`);

    const issueRows =
      report.issues.length > 0
        ? report.issues
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

    const headingRows = report.headings
      .map(
        (heading) => `
      <tr>
        <td>${heading.tag.toUpperCase()}</td>
        <td>${heading.text}</td>
        <td>${heading.classes.join(', ') || '-'}</td>
      </tr>
    `
      )
      .join('');

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SEO Report - ${pageName}</title>
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
    pre {
      background: #1a1a1a;
      padding: 1rem;
      border-radius: 4px;
      overflow-x: auto;
      line-height: 1.6;
      color: #22c55e;
      font-family: 'Courier New', monospace;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="status">${report.passed ? 'PASSED' : 'FAILED'}</div>
      <h1>SEO Validation Report</h1>
      <p><strong>${pageName}</strong> - ${new Date(report.timestamp).toLocaleString()}</p>

      <div class="stats">
        <div class="stat">
          <div class="stat-label">H1 Count</div>
          <div class="stat-value" style="color: ${report.h1Count === 1 ? '#22c55e' : '#ef4444'}">
            ${report.h1Count}
          </div>
        </div>
        <div class="stat">
          <div class="stat-label">Total Headings</div>
          <div class="stat-value">${report.totalHeadings}</div>
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

    ${
      report.issues.length > 0
        ? `
    <div class="section">
      <h2>Issues Found</h2>
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
    `
        : ''
    }

    <div class="section">
      <h2>Heading Hierarchy Tree</h2>
      <pre>${report.headingTree}</pre>
    </div>

    <div class="section">
      <h2>All Headings</h2>
      <table>
        <thead>
          <tr>
            <th>Tag</th>
            <th>Text</th>
            <th>Classes</th>
          </tr>
        </thead>
        <tbody>
          ${headingRows}
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
