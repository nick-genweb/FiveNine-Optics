# FiveNine Optics Testing System

Comprehensive automated quality assurance for the FiveNine Optics website using intelligent testing agents.

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Testing Agents](#testing-agents)
- [Running Tests](#running-tests)
- [Auto-Fix System](#auto-fix-system)
- [Reports & Visualization](#reports--visualization)
- [Configuration](#configuration)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)

---

## Overview

The FiveNine Optics testing system is a comprehensive quality assurance platform built with Jest and Puppeteer. It features four specialized testing agents that automatically validate:

- **SEO best practices** (heading hierarchy, meta tags)
- **Visual consistency** (pixel-perfect screenshot comparison)
- **HTML quality** (semantics, accessibility, best practices)
- **Responsive design** (multi-viewport testing, touch targets)

### Key Features

- 🤖 **4 Specialized Agents** - Each focused on a specific quality dimension
- 📊 **Rich HTML Reports** - Visual dashboards with screenshots and metrics
- 🔧 **Auto-Fix Capabilities** - Automatically fix common SEO and HTML issues
- 👁️ **Visual Regression Testing** - Pixel-diff comparison with reference screenshots
- 📱 **Multi-Viewport Testing** - Test across 5 viewports (mobile to wide desktop)
- 🔄 **Watch Mode** - Automatically re-run tests when files change
- 🚀 **CI/CD Ready** - GitHub Actions workflow included
- 📝 **110+ Test Cases** - Comprehensive coverage across 7 pages

---

## Quick Start

### 1. Install Dependencies

Dependencies are already installed, but if needed:

```bash
npm install
```

### 2. Generate Baseline Screenshots (First Time Only)

```bash
npm run test:baseline
```

This creates reference screenshots for visual regression testing.

### 3. Run All Tests

```bash
npm test
```

This runs all 4 agents and generates a comprehensive report.

### 4. View Results

```bash
npm run test:report
```

Opens the HTML dashboard in your browser.

---

## Testing Agents

### Agent 1: SEO Heading Hierarchy Validator

**Purpose:** Ensures proper heading structure for SEO and accessibility

**What it validates:**
- Every page has exactly one H1
- No skipped heading levels (e.g., H2 → H4)
- Decorative text not using heading tags
- Meaningful heading hierarchy

**Run individually:**
```bash
npm run test:seo
```

**Auto-fix:**
```bash
npm run test:fix-seo -- --no-dry-run
```

**Reports:** `tests/reports/seo-reports/`

---

### Agent 2: Visual Regression Validator

**Purpose:** Detects unintended visual changes through screenshot comparison

**What it validates:**
- Pixel-perfect comparison against reference screenshots
- Tests 7 pages × 5 viewports = 35 screenshots
- Highlights visual differences with pixel-diff overlays
- Configurable threshold (default: 1% difference tolerance)

**Run individually:**
```bash
npm run test:visual
```

**Update reference screenshots:**
```bash
npm run test:baseline
```

**Reports:** `tests/reports/visual-diffs/`

---

### Agent 3: HTML Best Practices Validator

**Purpose:** Validates HTML semantics, accessibility, and best practices

**What it validates:**
- All images have alt attributes
- Semantic HTML5 structure (header, main, nav, footer)
- Form elements have labels or aria-labels
- Meta tags (title, description, viewport)
- Link accessibility (no empty links, descriptive text)

**Run individually:**
```bash
npm run test:html
```

**Auto-fix:**
```bash
npm run test:fix-html -- --no-dry-run
```

**Reports:** `tests/reports/html-reports/`

---

### Agent 4: Responsive Design Validator

**Purpose:** Validates responsive behavior across multiple viewports

**What it validates:**
- No horizontal scroll at any viewport
- Touch targets ≥44x44px on mobile (WCAG 2.1 Level AAA)
- Readable font sizes (≥16px on mobile)
- Images load properly at all sizes
- Container max-width constraints
- Interactive elements work across viewports

**Run individually:**
```bash
npm run test:responsive
```

**Reports:** `tests/reports/responsive-reports/`

---

## Running Tests

### Run All Tests

```bash
npm test
```

Runs all 4 agents sequentially and generates the comprehensive report.

---

### Run Individual Agents

```bash
npm run test:seo          # SEO only
npm run test:visual       # Visual regression only
npm run test:html         # HTML best practices only
npm run test:responsive   # Responsive design only
```

---

### Watch Mode (Development)

```bash
npm run test:watch
```

Automatically re-runs tests when you save files. Great for active development!

---

### Run Specific Pages

```bash
npm test -- --testNamePattern="Markets Page"
npm test -- --testNamePattern="Home"
```

---

### Verbose Output

```bash
npm test -- --verbose
```

Shows detailed output for debugging.

---

## Auto-Fix System

The testing system can automatically fix common issues.

### Preview Fixes (Dry Run)

```bash
npm run test:fix
```

Shows what would be fixed without making changes.

---

### Apply All Fixes

```bash
npm run test:fix -- --no-dry-run
```

Applies SEO and HTML fixes. Creates `.backup` files before modifying.

---

### Apply Specific Fixes

```bash
# SEO fixes only
npm run test:fix-seo -- --no-dry-run

# HTML fixes only
npm run test:fix-html -- --no-dry-run
```

---

### What Gets Fixed

**SEO Fixes:**
- Adds missing H1 (converts first H2 to H1)
- Fixes multiple H1s (converts extras to H2)
- Removes heading tags from decorative elements
- Fixes skipped heading levels

**HTML Fixes:**
- Adds missing alt attributes to images
- Adds aria-labels to unlabeled form elements
- Adds viewport meta tag if missing
- Suggests meta descriptions

---

## Reports & Visualization

### HTML Dashboard

```bash
npm run test:report
```

Opens the main dashboard showing:
- Overall pass/fail status
- Test statistics (total, passed, errors, warnings)
- Agent-by-agent breakdown
- Links to detailed reports

**Location:** `tests/reports/index.html`

---

### Individual Agent Reports

Each agent generates:
- **JSON report** - Machine-readable test results
- **HTML report** - Human-readable with visualizations
- **Screenshots** - Visual evidence of issues

**Locations:**
- SEO: `tests/reports/seo-reports/`
- HTML: `tests/reports/html-reports/`
- Responsive: `tests/reports/responsive-reports/`
- Visual Diffs: `tests/reports/visual-diffs/`

---

### Screenshot Locations

- **Reference screenshots:** `tests/fixtures/reference-screenshots/`
- **Actual screenshots:** `tests/reports/actual-screenshots/`
- **Diff screenshots:** `tests/reports/visual-diffs/`

---

## Configuration

### Main Config File

All test settings are centralized in `tests/test.config.js`:

```javascript
module.exports = {
  baseUrl: 'http://localhost:8080',
  pages: [ /* 7 pages */ ],
  viewports: { /* 5 viewports */ },
  visualRegression: { /* threshold, dirs */ },
  seo: { /* SEO rules */ },
  html: { /* HTML rules */ },
  responsive: { /* responsive rules */ },
  puppeteer: { /* Puppeteer settings */ },
  autoFix: { /* auto-fix settings */ },
};
```

---

### Customize Viewports

Edit `tests/test.config.js`:

```javascript
viewports: {
  mobile: { width: 375, height: 812, name: 'Mobile' },
  tablet: { width: 768, height: 1024, name: 'Tablet' },
  // Add more viewports...
}
```

---

### Adjust Visual Regression Threshold

Edit `tests/test.config.js`:

```javascript
visualRegression: {
  threshold: 0.01, // 1% difference tolerance
  // Lower = stricter, Higher = more lenient
}
```

---

### Add/Remove Pages

Edit `tests/test.config.js`:

```javascript
pages: [
  { name: 'Home', path: '/', slug: 'index' },
  { name: 'About', path: '/about/', slug: 'about' },
  // Add more pages...
]
```

---

## CI/CD Integration

### GitHub Actions Workflow

A GitHub Actions workflow is included at `.github/workflows/test.yml`.

**Features:**
- Runs on every push/PR to main/develop
- Executes all 4 agents
- Uploads reports as artifacts
- Comments on PRs with test results
- Fails if critical errors found

**Activate by:**
1. Commit the `.github/workflows/test.yml` file
2. Push to GitHub
3. Tests run automatically on every push

---

### Manual Trigger

You can also manually trigger the workflow from GitHub's Actions tab.

---

## Troubleshooting

### Test Server Won't Start

**Problem:** `Error: listen EADDRINUSE: address already in use`

**Solution:**
```bash
# Find and kill process on port 8080
lsof -ti:8080 | xargs kill
```

---

### Visual Regression Tests Failing

**Problem:** All visual tests fail with "No reference screenshot found"

**Solution:**
```bash
npm run test:baseline
```

---

### Tests Timing Out

**Problem:** Tests exceed timeout limit

**Solution:** Increase timeout in `tests/jest.config.js`:
```javascript
testTimeout: 120000, // 2 minutes
```

---

### Auto-Fix Not Working

**Problem:** Fixes don't seem to apply

**Solution:**
1. Make sure you're using `--no-dry-run`:
   ```bash
   npm run test:fix -- --no-dry-run
   ```
2. Check `.backup` files were created
3. Rebuild the site: `npm start`

---

### Puppeteer Installation Issues

**Problem:** Puppeteer fails to install Chrome

**Solution:**
```bash
# Set environment variable and reinstall
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false
npm install puppeteer
```

---

### Tests Pass Locally But Fail in CI

**Problem:** Behavior differs between local and CI

**Solution:**
1. Check viewport sizes match
2. Ensure fonts load properly (may need font files, not just CDN)
3. Add wait times for animations
4. Check for timing-dependent content

---

## Directory Structure

```
tests/
├── agents/                      # Testing agents
│   ├── seo-validator.test.js
│   ├── visual-regression.test.js
│   ├── html-best-practices.test.js
│   └── responsive-design.test.js
│
├── fixtures/                    # Test fixtures
│   └── reference-screenshots/   # Visual regression baselines
│
├── utils/                       # Shared utilities
│   ├── puppeteer-helpers.js
│   ├── screenshot-differ.js
│   ├── html-parser.js
│   ├── generate-baseline.js
│   └── report-generator.js
│
├── fixes/                       # Auto-fix scripts
│   ├── seo-fixer.js
│   ├── html-fixer.js
│   └── apply-fixes.js
│
├── reports/                     # Generated reports
│   ├── index.html              # Main dashboard
│   ├── seo-reports/
│   ├── html-reports/
│   ├── responsive-reports/
│   ├── visual-diffs/
│   └── actual-screenshots/
│
├── jest.config.js              # Jest configuration
├── test.config.js              # Test configuration
├── setup.js                    # Test setup
└── README.md                   # This file
```

---

## Test Coverage

### Pages Tested (7)
- Home
- Markets
- Products
- Resources
- Contact
- Style Guide
- Annotated

### Viewports Tested (5)
- Mobile (375x812)
- Tablet (768x1024)
- Laptop (1024x768)
- Desktop (1440x900)
- Wide Desktop (1920x1080)

### Total Test Cases: ~110

- **SEO:** ~20 tests (1 per page + hierarchy checks)
- **Visual Regression:** 35 tests (7 pages × 5 viewports)
- **HTML Best Practices:** ~30 tests (accessibility, semantics, meta tags)
- **Responsive Design:** ~25 tests (layout, touch targets, scrolling)

---

## NPM Scripts Reference

| Script | Description |
|--------|-------------|
| `npm test` | Run all tests + generate report |
| `npm run test:watch` | Watch mode for development |
| `npm run test:seo` | SEO validator only |
| `npm run test:visual` | Visual regression only |
| `npm run test:html` | HTML best practices only |
| `npm run test:responsive` | Responsive design only |
| `npm run test:baseline` | Generate reference screenshots |
| `npm run test:fix` | Preview auto-fixes (dry run) |
| `npm run test:fix-seo` | Preview SEO fixes |
| `npm run test:fix-html` | Preview HTML fixes |
| `npm run test:report` | Open HTML dashboard |

---

## Best Practices

### 1. Run Tests Before Committing

```bash
npm test
```

Fix any errors before pushing to GitHub.

---

### 2. Update Baseline After Intentional Changes

If you intentionally changed the design:

```bash
npm run test:baseline
npm test  # Verify tests pass
```

---

### 3. Use Auto-Fix First

Before manually fixing issues:

```bash
npm run test:fix              # Preview
npm run test:fix -- --no-dry-run  # Apply
```

---

### 4. Check Reports for Details

Don't just look at console output:

```bash
npm run test:report
```

The HTML reports show exactly what's wrong with screenshots.

---

### 5. Test One Agent at a Time During Development

```bash
npm run test:watch
```

Faster feedback during active development.

---

## Contributing

### Adding a New Test

1. Choose the appropriate agent file in `tests/agents/`
2. Add your test using Jest syntax
3. Run `npm test` to verify
4. Update this README if needed

---

### Adding a New Page

1. Edit `tests/test.config.js`:
   ```javascript
   pages: [
     // ...
     { name: 'New Page', path: '/new/', slug: 'new' }
   ]
   ```
2. Regenerate baseline: `npm run test:baseline`
3. Run tests: `npm test`

---

### Modifying Auto-Fix Rules

1. Edit `tests/fixes/seo-fixer.js` or `html-fixer.js`
2. Test in dry-run mode: `npm run test:fix`
3. Verify fixes are correct
4. Update documentation

---

## Support

### Documentation
- **Migration Guide:** `legacy-tests/MIGRATION-GUIDE.md`
- **Test Config:** `tests/test.config.js`
- **SEO Strategy:** Root directory `SEO-HEADING-HIERARCHY-STRATEGY.md`

### Need Help?

1. Check this README
2. Review test configuration
3. Check individual agent files for inline documentation
4. Review generated HTML reports for detailed explanations

---

## License

This testing system is part of the FiveNine Optics project.

---

## Changelog

### v1.0.0 (2024-12-08)

**Initial Release**
- ✅ 4 specialized testing agents
- ✅ Auto-fix capabilities for SEO and HTML
- ✅ Visual regression testing with pixelmatch
- ✅ Responsive design validation
- ✅ HTML reports and dashboard
- ✅ GitHub Actions CI/CD workflow
- ✅ 110+ automated test cases
- ✅ Migration from legacy test scripts

---

**Questions? Issues? Suggestions?**

The testing system is designed to be comprehensive yet maintainable. If you have questions or find issues, consult this documentation first, then check the test configuration and individual agent files.

Happy testing! 🎉
