/**
 * Apply Fixes - Unified script to run all auto-fixers
 */

const SEOFixer = require('./seo-fixer');
const HTMLFixer = require('./html-fixer');

function applyAllFixes() {
  const dryRun = !process.argv.includes('--no-dry-run');
  const seoOnly = process.argv.includes('--seo-only');
  const htmlOnly = process.argv.includes('--html-only');

  console.log('\n' + '='.repeat(60));
  console.log('FiveNine Optics Auto-Fix System');
  console.log('='.repeat(60));

  if (dryRun) {
    console.log('\n⚠️  DRY RUN MODE - No changes will be made');
    console.log('Run with --no-dry-run to apply fixes\n');
  } else {
    console.log('\n🔧 APPLYING FIXES - Files will be modified');
    console.log('Backup files will be created with .backup extension\n');
  }

  // Run SEO fixer
  if (!htmlOnly) {
    SEOFixer.fixAllTemplates(dryRun);
  }

  // Run HTML fixer
  if (!seoOnly) {
    HTMLFixer.fixAllTemplates(dryRun);
  }

  console.log('\n' + '='.repeat(60));
  console.log('Auto-Fix Complete');
  console.log('='.repeat(60) + '\n');

  if (dryRun) {
    console.log('To apply these fixes:');
    console.log('  npm run test:fix -- --no-dry-run');
    console.log('\nOr fix specific issues:');
    console.log('  npm run test:fix -- --seo-only --no-dry-run');
    console.log('  npm run test:fix -- --html-only --no-dry-run\n');
  } else {
    console.log('✓ Fixes applied successfully!');
    console.log('\nNext steps:');
    console.log('  1. Review the changes in your template files');
    console.log('  2. Rebuild the site: npm start');
    console.log('  3. Run tests again: npm test\n');
  }
}

// Run if executed directly
if (require.main === module) {
  applyAllFixes();
}

module.exports = applyAllFixes;
