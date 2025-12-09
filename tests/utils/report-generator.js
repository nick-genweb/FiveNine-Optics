/**
 * Aggregate Report Generator
 * Generates a comprehensive HTML report from all test results
 */

const fs = require('fs');
const path = require('path');
const config = require('../test.config');

class ReportGenerator {
  static generate() {
    const reportDir = path.join(__dirname, '..', 'reports');
    const outputPath = path.join(reportDir, 'index.html');

    // Collect results from all agents
    const seoResults = this.collectSEOResults();
    const htmlResults = this.collectHTMLResults();
    const responsiveResults = this.collectResponsiveResults();

    // Calculate summary statistics
    const summary = {
      seo: this.calculateAgentSummary(seoResults),
      html: this.calculateAgentSummary(htmlResults),
      responsive: this.calculateAgentSummary(responsiveResults),
      timestamp: new Date().toISOString(),
    };

    // Generate HTML
    const html = this.generateHTML(summary, seoResults, htmlResults, responsiveResults);

    // Write file
    fs.writeFileSync(outputPath, html);

    console.log(`\n📊 Comprehensive test report generated: ${outputPath}\n`);

    return outputPath;
  }

  static collectSEOResults() {
    const seoDir = path.join(__dirname, '..', 'reports', 'seo-reports');
    if (!fs.existsSync(seoDir)) return [];

    return fs
      .readdirSync(seoDir)
      .filter((file) => file.endsWith('.json'))
      .map((file) => {
        const content = fs.readFileSync(path.join(seoDir, file), 'utf-8');
        return JSON.parse(content);
      });
  }

  static collectHTMLResults() {
    const htmlDir = path.join(__dirname, '..', 'reports', 'html-reports');
    if (!fs.existsSync(htmlDir)) return [];

    return fs
      .readdirSync(htmlDir)
      .filter((file) => file.endsWith('.json'))
      .map((file) => {
        const content = fs.readFileSync(path.join(htmlDir, file), 'utf-8');
        return JSON.parse(content);
      });
  }

  static collectResponsiveResults() {
    const responsiveDir = path.join(__dirname, '..', 'reports', 'responsive-reports');
    if (!fs.existsSync(responsiveDir)) return [];

    return fs
      .readdirSync(responsiveDir)
      .filter((file) => file.endsWith('.json'))
      .map((file) => {
        const content = fs.readFileSync(path.join(responsiveDir, file), 'utf-8');
        return JSON.parse(content);
      });
  }

  static calculateAgentSummary(results) {
    if (!results || results.length === 0) {
      return { total: 0, passed: 0, failed: 0, errors: 0, warnings: 0 };
    }

    const summary = {
      total: results.length,
      passed: results.filter((r) => r.passed).length,
      failed: results.filter((r) => !r.passed).length,
      errors: 0,
      warnings: 0,
    };

    results.forEach((result) => {
      if (result.summary) {
        summary.errors += result.summary.errors || 0;
        summary.warnings += result.summary.warnings || 0;
      } else if (result.issues) {
        summary.errors += result.issues.filter((i) => i.severity === 'error').length;
        summary.warnings += result.issues.filter((i) => i.severity === 'warning').length;
      }
    });

    return summary;
  }

  static generateHTML(summary, seoResults, htmlResults, responsiveResults) {
    const overallPassed =
      summary.seo.failed === 0 && summary.html.failed === 0 && summary.responsive.failed === 0;

    const totalErrors = summary.seo.errors + summary.html.errors + summary.responsive.errors;
    const totalWarnings = summary.seo.warnings + summary.html.warnings + summary.responsive.warnings;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FiveNine Optics - Test Dashboard</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      color: #fff;
      padding: 2rem;
      min-height: 100vh;
    }
    .container { max-width: 1400px; margin: 0 auto; }
    .header {
      background: ${overallPassed ? 'linear-gradient(135deg, #1a472a 0%, #22c55e 100%)' : 'linear-gradient(135deg, #561a1a 0%, #ef4444 100%)'};
      padding: 3rem;
      border-radius: 12px;
      margin-bottom: 2rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }
    .header h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      font-weight: 700;
    }
    .header p {
      opacity: 0.9;
      font-size: 1.125rem;
    }
    .status {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: bold;
      background: ${overallPassed ? '#22c55e' : '#ef4444'};
      margin-bottom: 1.5rem;
      font-size: 1.25rem;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }
    .stat-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      padding: 2rem;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    }
    .stat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    .stat-title {
      color: #888;
      font-size: 0.875rem;
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 0.05em;
    }
    .stat-icon {
      font-size: 2rem;
    }
    .stat-value {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
    .stat-label {
      color: #888;
      font-size: 0.875rem;
    }
    .agent-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }
    .agent-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      padding: 2rem;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    }
    .agent-card h2 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .progress-bar {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      height: 8px;
      overflow: hidden;
      margin: 1rem 0;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #22c55e 0%, #16a34a 100%);
      transition: width 0.3s ease;
    }
    .agent-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin-top: 1.5rem;
    }
    .agent-stat {
      text-align: center;
      padding: 1rem;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 8px;
    }
    .agent-stat-value {
      font-size: 1.75rem;
      font-weight: 700;
      margin-bottom: 0.25rem;
    }
    .agent-stat-label {
      font-size: 0.75rem;
      color: #888;
      text-transform: uppercase;
    }
    .error { color: #ef4444; }
    .warning { color: #f59e0b; }
    .success { color: #22c55e; }
    .footer {
      text-align: center;
      margin-top: 3rem;
      padding: 2rem;
      opacity: 0.6;
      font-size: 0.875rem;
    }
    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }
    .badge.success { background: #22c55e; color: #000; }
    .badge.error { background: #ef4444; color: #fff; }
    .badge.warning { background: #f59e0b; color: #000; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="status">${overallPassed ? '✓ ALL TESTS PASSED' : '✗ SOME TESTS FAILED'}</div>
      <h1>FiveNine Optics Testing Dashboard</h1>
      <p>Automated Quality Assurance Report</p>
      <p style="font-size: 0.875rem; margin-top: 0.5rem; opacity: 0.7;">
        Generated: ${new Date(summary.timestamp).toLocaleString()}
      </p>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-title">Total Tests</span>
          <span class="stat-icon">📊</span>
        </div>
        <div class="stat-value">${summary.seo.total + summary.html.total + summary.responsive.total}</div>
        <div class="stat-label">Across ${config.pages.length} pages</div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-title">Tests Passed</span>
          <span class="stat-icon">✅</span>
        </div>
        <div class="stat-value success">${summary.seo.passed + summary.html.passed + summary.responsive.passed}</div>
        <div class="stat-label">Successfully validated</div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-title">Errors</span>
          <span class="stat-icon">❌</span>
        </div>
        <div class="stat-value error">${totalErrors}</div>
        <div class="stat-label">Must be fixed</div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-title">Warnings</span>
          <span class="stat-icon">⚠️</span>
        </div>
        <div class="stat-value warning">${totalWarnings}</div>
        <div class="stat-label">Should be reviewed</div>
      </div>
    </div>

    <div class="agent-grid">
      <div class="agent-card">
        <h2>
          <span>🔍</span>
          <span>SEO Validator</span>
          <span class="badge ${summary.seo.failed === 0 ? 'success' : 'error'}">
            ${summary.seo.passed}/${summary.seo.total}
          </span>
        </h2>
        <p style="color: #888; margin-bottom: 1rem;">Heading hierarchy and SEO best practices</p>

        <div class="progress-bar">
          <div class="progress-fill" style="width: ${summary.seo.total > 0 ? (summary.seo.passed / summary.seo.total) * 100 : 0}%"></div>
        </div>

        <div class="agent-stats">
          <div class="agent-stat">
            <div class="agent-stat-value success">${summary.seo.passed}</div>
            <div class="agent-stat-label">Passed</div>
          </div>
          <div class="agent-stat">
            <div class="agent-stat-value error">${summary.seo.errors}</div>
            <div class="agent-stat-label">Errors</div>
          </div>
          <div class="agent-stat">
            <div class="agent-stat-value warning">${summary.seo.warnings}</div>
            <div class="agent-stat-label">Warnings</div>
          </div>
        </div>

        <div style="margin-top: 1.5rem;">
          <a href="seo-reports/" style="color: #3b82f6; text-decoration: none; font-weight: 600;">
            View Detailed Reports →
          </a>
        </div>
      </div>

      <div class="agent-card">
        <h2>
          <span>📝</span>
          <span>HTML Best Practices</span>
          <span class="badge ${summary.html.failed === 0 ? 'success' : 'error'}">
            ${summary.html.passed}/${summary.html.total}
          </span>
        </h2>
        <p style="color: #888; margin-bottom: 1rem;">Accessibility, semantics, and HTML validation</p>

        <div class="progress-bar">
          <div class="progress-fill" style="width: ${summary.html.total > 0 ? (summary.html.passed / summary.html.total) * 100 : 0}%"></div>
        </div>

        <div class="agent-stats">
          <div class="agent-stat">
            <div class="agent-stat-value success">${summary.html.passed}</div>
            <div class="agent-stat-label">Passed</div>
          </div>
          <div class="agent-stat">
            <div class="agent-stat-value error">${summary.html.errors}</div>
            <div class="agent-stat-label">Errors</div>
          </div>
          <div class="agent-stat">
            <div class="agent-stat-value warning">${summary.html.warnings}</div>
            <div class="agent-stat-label">Warnings</div>
          </div>
        </div>

        <div style="margin-top: 1.5rem;">
          <a href="html-reports/" style="color: #3b82f6; text-decoration: none; font-weight: 600;">
            View Detailed Reports →
          </a>
        </div>
      </div>

      <div class="agent-card">
        <h2>
          <span>📱</span>
          <span>Responsive Design</span>
          <span class="badge success">
            ${Object.keys(config.viewports).length} viewports
          </span>
        </h2>
        <p style="color: #888; margin-bottom: 1rem;">Multi-viewport testing and responsive validation</p>

        <div class="progress-bar">
          <div class="progress-fill" style="width: 100%"></div>
        </div>

        <div class="agent-stats">
          <div class="agent-stat">
            <div class="agent-stat-value success">${config.pages.length}</div>
            <div class="agent-stat-label">Pages</div>
          </div>
          <div class="agent-stat">
            <div class="agent-stat-value">${Object.keys(config.viewports).length}</div>
            <div class="agent-stat-label">Viewports</div>
          </div>
          <div class="agent-stat">
            <div class="agent-stat-value">${config.pages.length * Object.keys(config.viewports).length}</div>
            <div class="agent-stat-label">Tests</div>
          </div>
        </div>

        <div style="margin-top: 1.5rem;">
          <a href="responsive-reports/" style="color: #3b82f6; text-decoration: none; font-weight: 600;">
            View Detailed Reports →
          </a>
        </div>
      </div>

      <div class="agent-card" style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%);">
        <h2>
          <span>📸</span>
          <span>Visual Regression</span>
          <span class="badge success">Active</span>
        </h2>
        <p style="color: #888; margin-bottom: 1rem;">Pixel-perfect screenshot comparison</p>

        <div class="progress-bar">
          <div class="progress-fill" style="background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%);"></div>
        </div>

        <div class="agent-stats">
          <div class="agent-stat">
            <div class="agent-stat-value">${config.pages.length}</div>
            <div class="agent-stat-label">Pages</div>
          </div>
          <div class="agent-stat">
            <div class="agent-stat-value">${Object.keys(config.viewports).length}</div>
            <div class="agent-stat-label">Viewports</div>
          </div>
          <div class="agent-stat">
            <div class="agent-stat-value">${config.pages.length * Object.keys(config.viewports).length}</div>
            <div class="agent-stat-label">Screenshots</div>
          </div>
        </div>

        <div style="margin-top: 1.5rem;">
          <a href="visual-diffs/" style="color: #3b82f6; text-decoration: none; font-weight: 600;">
            View Visual Diffs →
          </a>
        </div>
      </div>
    </div>

    <div class="footer">
      <p>FiveNine Optics Automated Testing System</p>
      <p>Powered by Jest, Puppeteer, and Pixelmatch</p>
    </div>
  </div>
</body>
</html>
    `;
  }
}

// Run if executed directly
if (require.main === module) {
  ReportGenerator.generate();
}

module.exports = ReportGenerator;
