/**
 * Screenshot comparison utility using Pixelmatch
 */

const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch');
const config = require('../test.config');

class ScreenshotDiffer {
  /**
   * Compare two screenshots and generate diff image
   * @param {string} referencePath - Path to reference image
   * @param {string} actualPath - Path to actual screenshot
   * @param {string} diffPath - Path to save diff image
   * @param {object} options - Comparison options
   * @returns {object} Comparison result
   */
  static compare(referencePath, actualPath, diffPath, options = {}) {
    // Check if reference exists
    if (!fs.existsSync(referencePath)) {
      return {
        passed: false,
        reason: 'no-reference',
        message: 'Reference screenshot does not exist. Run baseline generation first.',
        referencePath,
        actualPath,
      };
    }

    // Read images
    const reference = PNG.sync.read(fs.readFileSync(referencePath));
    const actual = PNG.sync.read(fs.readFileSync(actualPath));

    // Check dimensions match
    if (reference.width !== actual.width || reference.height !== actual.height) {
      return {
        passed: false,
        reason: 'dimension-mismatch',
        message: `Image dimensions don't match. Reference: ${reference.width}x${reference.height}, Actual: ${actual.width}x${actual.height}`,
        referencePath,
        actualPath,
        referenceDimensions: { width: reference.width, height: reference.height },
        actualDimensions: { width: actual.width, height: actual.height },
      };
    }

    // Create diff image
    const { width, height } = reference;
    const diff = new PNG({ width, height });

    // Compare images
    const threshold = options.threshold || config.visualRegression.threshold;
    const includeAA = options.includeAA !== undefined ? options.includeAA : config.visualRegression.includeAA;
    const alpha = options.alpha || config.visualRegression.alpha;

    const numDiffPixels = pixelmatch(
      reference.data,
      actual.data,
      diff.data,
      width,
      height,
      {
        threshold,
        includeAA,
        alpha,
      }
    );

    // Calculate difference percentage
    const totalPixels = width * height;
    const diffPercentage = (numDiffPixels / totalPixels) * 100;

    // Save diff image if there are differences
    if (numDiffPixels > 0) {
      fs.writeFileSync(diffPath, PNG.sync.write(diff));
    }

    // Determine if test passed
    const passed = diffPercentage <= (threshold * 100);

    return {
      passed,
      reason: passed ? 'match' : 'visual-difference',
      message: passed
        ? `Screenshots match within tolerance (${diffPercentage.toFixed(2)}% difference)`
        : `Screenshots differ by ${diffPercentage.toFixed(2)}% (threshold: ${threshold * 100}%)`,
      referencePath,
      actualPath,
      diffPath: numDiffPixels > 0 ? diffPath : null,
      diffPixels: numDiffPixels,
      totalPixels,
      diffPercentage,
      threshold: threshold * 100,
    };
  }

  /**
   * Generate reference screenshot (baseline)
   */
  static saveReference(sourcePath, referencePath) {
    // Ensure directory exists
    const dir = path.dirname(referencePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Copy file
    fs.copyFileSync(sourcePath, referencePath);

    return {
      success: true,
      message: 'Reference screenshot saved',
      path: referencePath,
    };
  }

  /**
   * Generate filename for screenshot
   */
  static getScreenshotFilename(pageName, viewport, type = 'actual') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const slug = pageName.toLowerCase().replace(/\s+/g, '-');

    if (type === 'reference') {
      return `${slug}-${viewport}.png`;
    }

    return `${slug}-${viewport}-${timestamp}.png`;
  }

  /**
   * Get full path for screenshot based on type
   */
  static getScreenshotPath(filename, type = 'actual') {
    const dirs = {
      reference: config.visualRegression.referenceDir,
      actual: config.visualRegression.actualDir,
      diff: config.visualRegression.diffDir,
    };

    const dir = dirs[type] || dirs.actual;
    const fullDir = path.join(__dirname, '..', '..', dir);

    // Ensure directory exists
    if (!fs.existsSync(fullDir)) {
      fs.mkdirSync(fullDir, { recursive: true });
    }

    return path.join(fullDir, filename);
  }

  /**
   * Clean up old screenshots
   */
  static cleanupOldScreenshots(daysOld = 7) {
    const dirs = [
      config.visualRegression.actualDir,
      config.visualRegression.diffDir,
    ];

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    let deletedCount = 0;

    dirs.forEach((dir) => {
      const fullDir = path.join(__dirname, '..', '..', dir);
      if (!fs.existsSync(fullDir)) return;

      const files = fs.readdirSync(fullDir);

      files.forEach((file) => {
        const filepath = path.join(fullDir, file);
        const stats = fs.statSync(filepath);

        if (stats.mtime < cutoffDate) {
          fs.unlinkSync(filepath);
          deletedCount++;
        }
      });
    });

    return {
      success: true,
      message: `Cleaned up ${deletedCount} old screenshots`,
      deletedCount,
    };
  }

  /**
   * Update reference screenshot (after manual approval)
   */
  static updateReference(actualPath, referencePath) {
    if (!fs.existsSync(actualPath)) {
      return {
        success: false,
        message: 'Actual screenshot does not exist',
      };
    }

    // Ensure directory exists
    const dir = path.dirname(referencePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Copy actual to reference
    fs.copyFileSync(actualPath, referencePath);

    return {
      success: true,
      message: 'Reference screenshot updated',
      path: referencePath,
    };
  }

  /**
   * Generate HTML comparison view
   */
  static generateComparisonHTML(result, outputPath) {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Visual Comparison - ${path.basename(result.actualPath)}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: #1a1a1a;
      color: #fff;
      padding: 2rem;
    }
    .container { max-width: 1400px; margin: 0 auto; }
    .header {
      background: ${result.passed ? '#1a472a' : '#561a1a'};
      padding: 2rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }
    .status {
      display: inline-block;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      font-weight: bold;
      background: ${result.passed ? '#22c55e' : '#ef4444'};
      margin-bottom: 1rem;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }
    .stat { background: #2a2a2a; padding: 1rem; border-radius: 4px; }
    .stat-label { color: #888; font-size: 0.875rem; margin-bottom: 0.5rem; }
    .stat-value { font-size: 1.5rem; font-weight: bold; }
    .comparison {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 2rem;
      margin-top: 2rem;
    }
    .image-container {
      background: #2a2a2a;
      padding: 1rem;
      border-radius: 8px;
    }
    .image-container h3 {
      margin-bottom: 1rem;
      color: #888;
      font-size: 0.875rem;
      text-transform: uppercase;
    }
    img {
      width: 100%;
      border-radius: 4px;
      border: 1px solid #444;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="status">${result.passed ? 'PASSED' : 'FAILED'}</div>
      <h1>Visual Regression Test</h1>
      <p>${result.message}</p>

      <div class="stats">
        <div class="stat">
          <div class="stat-label">Difference</div>
          <div class="stat-value">${result.diffPercentage?.toFixed(2) || 0}%</div>
        </div>
        <div class="stat">
          <div class="stat-label">Different Pixels</div>
          <div class="stat-value">${result.diffPixels?.toLocaleString() || 0}</div>
        </div>
        <div class="stat">
          <div class="stat-label">Threshold</div>
          <div class="stat-value">${result.threshold || 0}%</div>
        </div>
      </div>
    </div>

    <div class="comparison">
      <div class="image-container">
        <h3>Reference (Expected)</h3>
        <img src="${path.relative(path.dirname(outputPath), result.referencePath)}" alt="Reference">
      </div>

      <div class="image-container">
        <h3>Actual (Current)</h3>
        <img src="${path.relative(path.dirname(outputPath), result.actualPath)}" alt="Actual">
      </div>

      ${
        result.diffPath
          ? `
      <div class="image-container">
        <h3>Difference</h3>
        <img src="${path.relative(path.dirname(outputPath), result.diffPath)}" alt="Diff">
      </div>
      `
          : ''
      }
    </div>
  </div>
</body>
</html>
    `;

    fs.writeFileSync(outputPath, html);

    return outputPath;
  }
}

module.exports = ScreenshotDiffer;
