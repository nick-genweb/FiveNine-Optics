/**
 * SEO Fixer - Automatically fix heading hierarchy issues
 */

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

class SEOFixer {
  /**
   * Fix heading hierarchy issues in a file
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

    // Fix 1: Ensure H1 exists on every page
    const h1Count = $('h1').length;
    if (h1Count === 0) {
      // Find the first H2 and convert it to H1
      const firstH2 = $('h2').first();
      if (firstH2.length > 0) {
        const h2Text = firstH2.text().trim();
        const h2Html = firstH2.html();
        const h2Classes = firstH2.attr('class');
        const h2Id = firstH2.attr('id');

        fixes.push({
          type: 'add-h1-from-h2',
          description: `Convert first H2 to H1: "${h2Text}"`,
          before: `<h2>${h2Html}</h2>`,
          after: `<h1>${h2Html}</h1>`,
        });

        if (!dryRun) {
          let h1 = $('<h1>').html(h2Html);
          if (h2Classes) h1.attr('class', h2Classes);
          if (h2Id) h1.attr('id', h2Id);
          firstH2.replaceWith(h1);
        }
      }
    } else if (h1Count > 1) {
      // Fix 2: Multiple H1s - convert extras to H2
      $('h1')
        .not(':first')
        .each((index, element) => {
          const $el = $(element);
          const h1Text = $el.text().trim();
          const h1Html = $el.html();
          const h1Classes = $el.attr('class');
          const h1Id = $el.attr('id');

          fixes.push({
            type: 'multiple-h1-to-h2',
            description: `Convert extra H1 to H2: "${h1Text}"`,
            before: `<h1>${h1Html}</h1>`,
            after: `<h2>${h1Html}</h2>`,
          });

          if (!dryRun) {
            let h2 = $('<h2>').html(h1Html);
            if (h1Classes) h2.attr('class', h1Classes);
            if (h1Id) h2.attr('id', h1Id);
            $el.replaceWith(h2);
          }
        });
    }

    // Fix 3: Remove headings from decorative elements
    const decorativeSelectors = [
      '.team-member h3', // Team member names
      '.market-card h3', // Market card titles
      '.feature-card h3', // Feature titles (if they're decorative)
    ];

    decorativeSelectors.forEach((selector) => {
      $(selector).each((index, element) => {
        const $el = $(element);
        const text = $el.text().trim();
        const html = $el.html();
        const classes = $el.attr('class');
        const id = $el.attr('id');

        fixes.push({
          type: 'decorative-heading-to-div',
          description: `Convert decorative ${element.tagName} to div: "${text}"`,
          selector,
          before: `<${element.tagName}>${html}</${element.tagName}>`,
          after: `<div>${html}</div>`,
        });

        if (!dryRun) {
          let div = $('<div>').html(html);
          if (classes) div.attr('class', classes);
          if (id) div.attr('id', id);
          $el.replaceWith(div);
        }
      });
    });

    // Fix 4: Fix skipped heading levels
    const headings = [];
    $('h1, h2, h3, h4, h5, h6').each((index, element) => {
      const tag = element.tagName.toLowerCase();
      const level = parseInt(tag.substring(1));
      headings.push({ element, $el: $(element), level, tag });
    });

    for (let i = 1; i < headings.length; i++) {
      const current = headings[i];
      const previous = headings[i - 1];
      const levelJump = current.level - previous.level;

      if (levelJump > 1) {
        // Skipped a level - adjust current heading
        const correctLevel = previous.level + 1;
        const correctTag = `h${correctLevel}`;
        const text = current.$el.text().trim();
        const html = current.$el.html();
        const classes = current.$el.attr('class');
        const id = current.$el.attr('id');

        fixes.push({
          type: 'fix-skipped-level',
          description: `Fix skipped level: ${current.tag} → ${correctTag} for "${text}"`,
          before: `<${current.tag}>${html}</${current.tag}>`,
          after: `<${correctTag}>${html}</${correctTag}>`,
        });

        if (!dryRun) {
          let newHeading = $(`<${correctTag}>`).html(html);
          if (classes) newHeading.attr('class', classes);
          if (id) newHeading.attr('id', id);
          current.$el.replaceWith(newHeading);

          // Update the heading in our array
          headings[i].tag = correctTag;
          headings[i].level = correctLevel;
        }
      }
    }

    // Report fixes
    if (fixes.length > 0) {
      console.log(`  Found ${fixes.length} issue(s):`);
      fixes.forEach((fix, index) => {
        console.log(`  ${index + 1}. [${fix.type}] ${fix.description}`);
      });

      if (!dryRun) {
        // Backup original file
        const backupPath = filepath + '.backup';
        fs.writeFileSync(backupPath, content);
        console.log(`  ✓ Backup created: ${backupPath}`);

        // Write fixed content
        const fixed = $.html();
        fs.writeFileSync(filepath, fixed);
        console.log(`  ✓ Fixed ${fixes.length} issue(s)`);
      } else {
        console.log(`  ℹ️  Dry run - no changes made`);
      }
    } else {
      console.log(`  ✓ No SEO issues found`);
    }

    return {
      filepath,
      fixes,
      fixCount: fixes.length,
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
    console.log(`SEO Auto-Fix ${dryRun ? '(DRY RUN - Preview Only)' : '(APPLYING FIXES)'}`);
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
      console.log(`  npm run test:fix -- --no-dry-run`);
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
  SEOFixer.fixAllTemplates(dryRun);
}

module.exports = SEOFixer;
