/**
 * HTML Fixer - Automatically fix HTML best practices issues
 */

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

class HTMLFixer {
  /**
   * Fix HTML issues in a file
   */
  static fixFile(filepath, dryRun = false) {
    console.log(`\n${dryRun ? '🔍 Analyzing' : '🔧 Fixing'}: ${filepath}`);

    // Read file
    const content = fs.readFileSync(filepath, 'utf-8');
    const $ = cheerio.load(content, {
      decodeEntities: false,
      xmlMode: false,
    });

    const fixes = [];

    // Fix 1: Add missing alt attributes to images
    $('img').each((index, element) => {
      const $img = $(element);
      const src = $img.attr('src');
      const hasAlt = $img.attr('alt') !== undefined;

      if (!hasAlt) {
        // Generate alt text from filename
        const filename = path.basename(src || '', path.extname(src || ''));
        const altText = filename
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, (l) => l.toUpperCase());

        fixes.push({
          type: 'add-alt-text',
          description: `Add alt attribute to image: ${src}`,
          before: `<img src="${src}">`,
          after: `<img src="${src}" alt="${altText}">`,
        });

        if (!dryRun) {
          $img.attr('alt', altText);
        }
      } else if ($img.attr('alt').trim() === '') {
        // Empty alt - note this (might be intentional for decorative images)
        fixes.push({
          type: 'empty-alt-text',
          description: `Image has empty alt (OK if decorative): ${src}`,
          severity: 'info',
        });
      }
    });

    // Fix 2: Add missing labels to form inputs
    $('input, textarea, select').each((index, element) => {
      const $el = $(element);
      const id = $el.attr('id');
      const type = $el.attr('type') || element.tagName.toLowerCase();
      const ariaLabel = $el.attr('aria-label');
      const placeholder = $el.attr('placeholder');

      // Check if label exists
      let hasLabel = false;
      if (id) {
        hasLabel = $(`label[for="${id}"]`).length > 0;
      }

      if (!hasLabel && !ariaLabel) {
        // Generate aria-label from placeholder or type
        const labelText = placeholder || type.replace(/[-_]/g, ' ');

        fixes.push({
          type: 'add-aria-label',
          description: `Add aria-label to ${type} input${id ? ` (id="${id}")` : ''}`,
          before: $el.toString(),
          after: `with aria-label="${labelText}"`,
        });

        if (!dryRun) {
          $el.attr('aria-label', labelText);
        }
      }
    });

    // Fix 3: Check for viewport meta tag
    const hasViewport = $('meta[name="viewport"]').length > 0;
    if (!hasViewport && $('head').length > 0) {
      fixes.push({
        type: 'add-viewport-meta',
        description: 'Add viewport meta tag',
        before: '<head>',
        after: '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
      });

      if (!dryRun) {
        $('head').prepend(
          '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
        );
      }
    }

    // Fix 4: Check for meta description
    const hasDescription = $('meta[name="description"]').length > 0;
    if (!hasDescription && $('head').length > 0) {
      // Get page title for description
      const title = $('title').text() || 'Page';

      fixes.push({
        type: 'add-meta-description',
        description: 'Add meta description',
        severity: 'warning',
        before: '<head>',
        after: `<meta name="description" content="${title} - FiveNine Optics">`,
      });

      if (!dryRun) {
        $('head').append(
          `<meta name="description" content="${title} - FiveNine Optics">`
        );
      }
    }

    // Report fixes
    if (fixes.length > 0) {
      const criticalFixes = fixes.filter((f) => f.severity !== 'info' && f.severity !== 'warning');
      const warnings = fixes.filter((f) => f.severity === 'warning');
      const info = fixes.filter((f) => f.severity === 'info');

      console.log(`  Found ${fixes.length} issue(s):`);
      if (criticalFixes.length > 0) {
        console.log(`    ${criticalFixes.length} critical fix(es)`);
      }
      if (warnings.length > 0) {
        console.log(`    ${warnings.length} warning(s)`);
      }
      if (info.length > 0) {
        console.log(`    ${info.length} info message(s)`);
      }

      fixes.forEach((fix, index) => {
        const icon = fix.severity === 'info' ? 'ℹ️' : fix.severity === 'warning' ? '⚠️' : '🔧';
        console.log(`  ${index + 1}. ${icon} [${fix.type}] ${fix.description}`);
      });

      if (!dryRun) {
        // Backup original file
        const backupPath = filepath + '.backup';
        fs.writeFileSync(backupPath, content);
        console.log(`  ✓ Backup created: ${backupPath}`);

        // Write fixed content
        const fixed = $.html();
        fs.writeFileSync(filepath, fixed);
        console.log(`  ✓ Fixed ${criticalFixes.length} issue(s)`);
      } else {
        console.log(`  ℹ️  Dry run - no changes made`);
      }
    } else {
      console.log(`  ✓ No HTML issues found`);
    }

    return {
      filepath,
      fixes,
      fixCount: fixes.filter((f) => f.severity !== 'info' && f.severity !== 'warning').length,
      applied: !dryRun,
    };
  }

  /**
   * Fix all template files
   */
  static fixAllTemplates(dryRun = true) {
    const srcDir = path.join(__dirname, '../../src');
    const templateFiles = [
      path.join(srcDir, 'index.njk'),
      path.join(srcDir, 'markets.njk'),
      path.join(srcDir, 'products.njk'),
      path.join(srcDir, 'resources.njk'),
      path.join(srcDir, 'contact.njk'),
    ];

    console.log(`\n${'='.repeat(60)}`);
    console.log(`HTML Best Practices Auto-Fix ${dryRun ? '(DRY RUN - Preview Only)' : '(APPLYING FIXES)'}`);
    console.log(`${'='.repeat(60)}`);

    const results = templateFiles
      .filter((file) => fs.existsSync(file))
      .map((file) => this.fixFile(file, dryRun));

    // Summary
    console.log(`\n${'='.repeat(60)}`);
    console.log('Summary:');
    console.log(`${'='.repeat(60)}`);
    console.log(`Files processed: ${results.length}`);
    console.log(`Total fixes: ${results.reduce((sum, r) => sum + r.fixCount, 0)}`);

    if (dryRun) {
      console.log(`\nTo apply these fixes, run:`);
      console.log(`  npm run test:fix-html -- --no-dry-run`);
    } else {
      console.log(`\n✓ All fixes applied!`);
      console.log(`\nBackup files created with .backup extension`);
      console.log(`Review changes and rebuild your site with: npm start`);
    }

    return results;
  }
}

// Run if executed directly
if (require.main === module) {
  const dryRun = !process.argv.includes('--no-dry-run');
  HTMLFixer.fixAllTemplates(dryRun);
}

module.exports = HTMLFixer;
