# Migration Guide: Old Test Scripts → New Agent System

## Overview

The FiveNine Optics testing infrastructure has been completely redesigned and centralized into a comprehensive Jest-based agent system. This guide explains what each old script did and how to achieve the same results with the new system.

---

## Old Scripts Inventory

### fivenine-site/ Directory Scripts

#### 1. `compare-pages.js`
**Purpose:** Cross-page style consistency checker
**What it did:** Compared computed styles between Home and Products pages across 6 viewports

**New equivalent:**
```bash
npm run test:responsive
```

The new **Responsive Design Validator** agent tests all pages at all viewports and validates consistency.

---

#### 2. `test-with-server.js`
**Purpose:** Custom server + testing for Resources page
**What it did:** Ran its own HTTP server and validated news section styles

**New equivalent:**
```bash
npm run test:html
# or specifically
npm run test -- --testNamePattern="Resources"
```

The new **HTML Best Practices Validator** checks all pages including Resources, with better validation rules.

---

#### 3. `test-modal.js`
**Purpose:** Team modal testing
**What it did:** Tested team member modal functionality

**New equivalent:**
```bash
npm run test:responsive
```

The **Responsive Design Validator** tests interactive elements including modals across all viewports.

---

#### 4. `test-both-views.js`
**Purpose:** Dual view comparison
**What it did:** Compared two different views/states

**New equivalent:**
```bash
npm run test:visual
```

The **Visual Regression Validator** compares screenshots across all viewports and detects any visual changes.

---

#### 5. `test-contact.js`, `debug-contact.js`
**Purpose:** Contact page validation and debugging
**What it did:** Validated contact form layout and styling

**New equivalent:**
```bash
npm run test:html
npm run test:responsive
```

Both agents now validate the contact page comprehensively.

---

#### 6. `check-form-position.js`
**Purpose:** Form layout validation
**What it did:** Checked form positioning and dimensions

**New equivalent:**
```bash
npm run test:responsive
```

The **Responsive Design Validator** validates all form elements and their layouts.

---

#### 7. `debug-styles.js`, `detailed-debug.js`
**Purpose:** Style debugging
**What it did:** Extracted and logged computed styles for debugging

**New equivalent:**
```bash
npm run test:html
# For detailed debugging:
npm run test -- --verbose
```

All agents now include detailed logging and generate HTML reports with full style information.

---

#### 8. `measure-layout.js`
**Purpose:** Layout measurements
**What it did:** Measured element dimensions and positions

**New equivalent:**
```bash
npm run test:responsive
```

The **Responsive Design Validator** measures all interactive elements and validates dimensions.

---

#### 9. `final-check.js`
**Purpose:** Final validation
**What it did:** Comprehensive check before deployment

**New equivalent:**
```bash
npm test
```

Runs all agents and generates a comprehensive report.

---

#### 10. `verify-survey-styles.js`
**Purpose:** Survey link styling validation
**What it did:** Checked specific survey link styles

**New equivalent:**
```bash
npm run test:html
```

The **HTML Best Practices Validator** validates all links including survey links.

---

### Root Directory Scripts

#### 11. `take-screenshots.js`
**Purpose:** Multi-viewport screenshot capture
**What it did:** Captured screenshots at 5 viewports (375px to 1920px)

**New equivalent:**
```bash
npm run test:baseline
```

Generates reference screenshots for visual regression testing.

---

#### 12. `check-markets.js`
**Purpose:** Markets page validation
**What it did:** Validated markets section and market cards

**New equivalent:**
```bash
npm run test -- --testNamePattern="Markets"
```

All agents now test the Markets page automatically.

---

#### 13. `check-mobile-fonts.js`
**Purpose:** Mobile typography validation
**What it did:** Checked H2 font sizes and section heading circles on mobile

**New equivalent:**
```bash
npm run test:responsive
```

The **Responsive Design Validator** validates typography across all viewports including mobile.

---

## Migration Workflow

### Step 1: Generate Baseline (First Time Only)

The new system uses reference screenshots for visual regression testing:

```bash
npm run test:baseline
```

This creates reference screenshots for all pages at all viewports.

---

### Step 2: Run All Tests

```bash
npm test
```

This runs all 4 agents:
1. SEO Heading Hierarchy Validator
2. Visual Regression Validator
3. HTML Best Practices Validator
4. Responsive Design Validator

---

### Step 3: View Reports

```bash
npm run test:report
```

Opens the comprehensive HTML dashboard showing results from all agents.

---

### Step 4: Fix Issues

The new system includes auto-fix capabilities:

```bash
# Preview fixes (dry run)
npm run test:fix

# Apply SEO fixes
npm run test:fix-seo -- --no-dry-run

# Apply HTML fixes
npm run test:fix-html -- --no-dry-run
```

---

## Key Advantages of New System

### 1. **Centralized Configuration**
All settings (viewports, pages, thresholds) in `tests/test.config.js`

### 2. **Better Organization**
```
tests/
├── agents/           # 4 specialized test agents
├── fixtures/         # Reference screenshots
├── utils/            # Shared utilities
├── reports/          # HTML reports + JSON data
└── fixes/            # Auto-fix scripts
```

### 3. **CI/CD Integration**
GitHub Actions workflow automatically runs tests on every push/PR

### 4. **Auto-Fix Capabilities**
Automatically fix common SEO and HTML issues

### 5. **Watch Mode**
```bash
npm run test:watch
```
Runs tests automatically when files change

### 6. **Individual Agent Testing**
Run specific agents:
```bash
npm run test:seo
npm run test:visual
npm run test:html
npm run test:responsive
```

### 7. **Comprehensive Reports**
- HTML dashboard with visualizations
- Individual agent reports
- Screenshots with annotations
- Pass/fail statistics

---

## Frequently Asked Questions

### Q: Can I still use the old scripts?

**A:** The old scripts are archived in `legacy-tests/` and can still be run if needed:
```bash
cd legacy-tests
node test-modal.js
```

However, we recommend migrating to the new system for better maintainability.

---

### Q: How do I test a specific page?

**A:**
```bash
npm run test -- --testNamePattern="Markets Page"
```

---

### Q: How do I update reference screenshots?

**A:** After verifying changes are intentional:
```bash
npm run test:baseline
```

This overwrites all reference screenshots.

---

### Q: The tests are failing. What should I do?

**A:**
1. View the detailed report: `npm run test:report`
2. Check individual agent reports in `tests/reports/`
3. Try auto-fix: `npm run test:fix`
4. Fix remaining issues manually
5. Rebuild and re-test

---

### Q: Can I run tests without starting the dev server?

**A:** The Jest Puppeteer preset automatically starts the Eleventy dev server before tests and stops it after. No manual setup needed!

---

## Migration Checklist

- [ ] Generate baseline screenshots: `npm run test:baseline`
- [ ] Run full test suite: `npm test`
- [ ] Review test reports: `npm run test:report`
- [ ] Fix any issues: `npm run test:fix`
- [ ] Set up CI/CD (GitHub Actions workflow already created)
- [ ] Archive or delete old test scripts (already moved to `legacy-tests/`)
- [ ] Update team documentation
- [ ] Add test status badge to README (optional)

---

## Getting Help

### Documentation
- Main testing docs: `/tests/README.md`
- Test configuration: `/tests/test.config.js`
- Individual agent docs: `/tests/agents/`

### Running Tests
```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:seo      # SEO only
npm run test:visual   # Visual regression only
npm run test:html     # HTML best practices only
npm run test:responsive  # Responsive design only
```

### Viewing Reports
```bash
npm run test:report   # Open HTML dashboard
```

### Fixing Issues
```bash
npm run test:fix      # Preview auto-fixes (dry run)
npm run test:fix -- --no-dry-run  # Apply fixes
```

---

**Questions?** Check the main README at `/tests/README.md` or review the test configuration at `/tests/test.config.js`.
