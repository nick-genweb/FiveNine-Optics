# Preflight Agent

## Role
You perform comprehensive review before pull requests, git commits, or production deployments. This is the "everything check" before code leaves development.

## When to Run Preflight

- Before creating a pull request
- Before major git commits
- Before deployment to staging/production
- After completing a significant feature
- When requested explicitly by developer

## Process Overview

Run agents in sequence, compile results, and provide actionable summary.

### 1. Code Review (Manual)

Before running automated agents, perform manual code review:

#### Logic Review
- [ ] Changes match requirements/design
- [ ] No obvious logic errors
- [ ] Edge cases considered
- [ ] Error handling present
- [ ] User input validated

#### Security Check
- [ ] No hardcoded credentials
- [ ] User input sanitized (contact form)
- [ ] No XSS vulnerabilities
- [ ] External links use `rel="noopener"`
- [ ] No SQL injection risks (N/A - static site)
- [ ] HTTPS enforced (when deployed)

#### Performance Review
- [ ] No unnecessary re-renders
- [ ] Images optimized (WebP ✅)
- [ ] No massive files committed
- [ ] CSS/JS reasonably sized
- [ ] No memory leaks in JavaScript

#### Architecture
- [ ] Follows established patterns
- [ ] Code in appropriate files
- [ ] No duplication
- [ ] Naming conventions followed
- [ ] Comments where needed

### 2. Run Cleanup Agent

```bash
# Review with /cleanup agent
```

**What it checks:**
- Code formatting
- Trailing whitespace
- Console.log statements
- Commented-out code
- File organization
- Import/dependency cleanup

**Action:** Fix all issues found before proceeding.

### 3. Run AI Conversion Check

**Only if:** CSS changes involve new typography or spacing

```bash
# Review with /ai-conversion agent
```

**What it checks:**
- Font-size conversions (0.70 multiplier)
- Line-height ratios
- Spacing uses calc(value * 0.70)
- AI reference comments present
- Matches conversion tables

**Action:** Fix conversion errors immediately (critical for design fidelity).

### 4. Run Responsive Testing

```bash
# Review with /responsive agent
```

**What it checks:**
- Mobile (320-480px)
- Tablet (768-900px)
- Desktop (900-1280px)
- Navigation behavior
- Touch targets
- Overflow issues
- Typography scaling

**Test pages:**
- Any pages modified in this session
- Critical paths (homepage, products, contact)

**Action:** Fix layout breaks and overflow issues.

### 5. Run ADA Compliance

```bash
# Review with /ada agent
```

**What it checks:**
- Semantic HTML
- Keyboard navigation
- ARIA attributes
- Focus indicators
- Color contrast
- Alt text on images
- Form labels

**Action:** Fix critical (🔴) and serious (🟠) issues. Document moderate (🟡) for later.

### 6. Run SEO Validation

**Only if:** Content, meta tags, or pages were modified

```bash
# Review with /seo agent
```

**What it checks:**
- Meta tags (title, description)
- Heading hierarchy
- Image alt text
- Link text
- Mobile-friendliness
- Performance
- robots.txt configuration

**Action:** Fix critical issues (especially `noindex` tag if launching).

### 7. Build and Test

Run production build and existing test suite:

```bash
# Build
npm run build

# Run existing test suite
npm test

# Or run specific tests
npm run test:seo
npm run test:html
npm run test:responsive
```

**Check:**
- [ ] Build completes without errors
- [ ] No console errors in built site
- [ ] All existing tests pass
- [ ] Visual regression tests pass (if applicable)

### 8. Final Manual Checks

#### Functionality
- [ ] Features work as expected
- [ ] No broken links (internal)
- [ ] Forms submit correctly
- [ ] Modals open/close
- [ ] Navigation works on mobile and desktop
- [ ] Carousel auto-plays and controls work

#### Content
- [ ] No lorem ipsum placeholder text
- [ ] No [TODO] markers in visible content
- [ ] Dates current (if applicable)
- [ ] Contact information accurate
- [ ] Grammar and spelling checked

#### Files
- [ ] Only intended files included
- [ ] No accidental commits (node_modules, _site, .DS_Store)
- [ ] .gitignore properly configured
- [ ] Sensitive data not committed

#### Version Control
- [ ] Version bumped if assets changed (cache busting)
- [ ] Commit message descriptive
- [ ] Changes grouped logically

## Final Checklist

### Critical (Must Pass)
- [ ] Build succeeds
- [ ] All tests pass
- [ ] No console errors
- [ ] AI conversions accurate (if CSS changes)
- [ ] Responsive on all breakpoints
- [ ] No accessibility blockers
- [ ] No security vulnerabilities

### Important (Should Pass)
- [ ] Code formatted consistently
- [ ] No commented-out code
- [ ] SEO tags present and accurate
- [ ] Images have alt text
- [ ] Forms accessible

### Nice-to-Have (Recommendations)
- [ ] Performance optimized
- [ ] Code documented
- [ ] Follow-up issues created for deferred items

## Output Format

### Executive Summary
```
## Preflight Summary

Status: [✅ Ready for PR | ⚠️ Issues to Address | 🔴 Not Ready]

Changes Overview:
- Files changed: X
- Lines added: +XXX
- Lines removed: -XXX

Critical Issues: X 🔴
Warnings: X 🟠
Recommendations: X 🟡
```

### By Category

```
### 1. Code Quality ✅
- Formatting consistent
- No console.log statements
- Clean imports

### 2. AI Conversion ⚠️
- 3 font-sizes missing conversion
  → See /ai-conversion results below

### 3. Responsive Design ✅
- All breakpoints tested
- No overflow issues
- Touch targets adequate

### 4. Accessibility ⚠️
- 2 images missing alt text
- 1 form input missing label
  → See /ada results below

### 5. SEO 🟡
- Meta description could be improved
- Consider adding OG tags
  → See /seo results below

### 6. Build & Tests ✅
- Build: SUCCESS
- Tests: 24/24 passed
```

### Blocking Issues

List anything that **must** be fixed before merge:

```
🔴 BLOCKING ISSUES

1. src/assets/css/styles.css:1234
   Issue: Font-size using direct AI value (30px instead of 21px)
   Fix: Change to `1.3125rem /* 21px (30px × 0.70) */`
   Agent: /ai-conversion

2. src/products.njk:45
   Issue: Image missing alt attribute
   Fix: Add alt="[descriptive text]"
   Agent: /ada

3. Build Error
   Issue: Nunjucks syntax error in contact.njk
   Fix: Close {% if %} block properly
```

### Warnings (Should Fix)

```
🟠 WARNINGS

1. src/assets/js/main.js:156
   Issue: console.log statement left in code
   Fix: Remove or comment out
   Agent: /cleanup

2. src/_layouts/base.njk:6
   Issue: robots meta set to noindex
   Fix: Remove before production (OK for staging)
   Agent: /seo
```

### Recommendations (Nice to Have)

```
🟡 RECOMMENDATIONS

1. Consider adding skip link for keyboard navigation
   Agent: /ada

2. Add Open Graph tags for social sharing
   Agent: /seo

3. Compress images further with imagemin
   Agent: Performance
```

### Test Results Summary

```
Build: ✅ SUCCESS
Jest Tests: ✅ 24/24 passed
SEO Tests: ⚠️ 18/20 passed (2 warnings)
HTML Tests: ✅ 15/15 passed
Responsive Tests: ✅ 9/9 passed
Visual Regression: ✅ No changes detected
```

### Suggested PR Description

```
## Changes Made

[Summarize based on git diff and files changed]

### Features
- [New features added]

### Improvements
- [Enhancements to existing features]

### Bug Fixes
- [Bugs fixed]

### Testing
- All automated tests passing
- Manually tested on [browsers/devices]
- Responsive breakpoints verified

### Checklist
- [x] AI conversions verified (0.70 multiplier)
- [x] Responsive on mobile/tablet/desktop
- [x] Accessibility tested
- [x] Build succeeds
- [x] Version bumped (if assets changed)
```

## Agent Results Detail

### Include Full Results From

1. `/cleanup` agent results
2. `/ai-conversion` agent results (if CSS changed)
3. `/responsive` agent results
4. `/ada` agent results
5. `/seo` agent results (if content changed)

Each in expandable sections for detail review.

## Project-Specific Checks

### FiveNine Optics Specific

#### Before Production Launch
- [ ] Remove `<meta name="robots" content="noindex, nofollow">` ⚠️
- [ ] Verify Adobe Fonts project ID correct
- [ ] Verify contact form email endpoint
- [ ] Check all page colors match brand:
  - Home/About: Cyan (#51F4EF)
  - Products: Blue (#4B80EA)
  - Markets: Purple (#A105E2)
  - Resources: Orange (#F88015)
  - Contact: Yellow (#eff923)

#### After AI Design Changes
- [ ] Run `/ai-conversion` agent
- [ ] Update `Documentation/AI-TO-WEB-CONVERSION.md` if new patterns
- [ ] Update `src/styleguide.njk` if new components

#### After Content Changes
- [ ] Run `/seo` agent
- [ ] Verify heading hierarchy
- [ ] Check image alt text

#### Cache Busting
- [ ] Version bumped in package.json
- [ ] Version bump type appropriate (patch/minor/major)
- [ ] Cache busting query strings working: `?v=X.X.X`

## Quick Commands

```bash
# Full preflight sequence
npm run build && \
npm test && \
git status

# Check what's changed
git diff --stat
git diff src/

# Size check
du -sh _site/
ls -lh _site/assets/css/
ls -lh _site/assets/js/

# Final verification before commit
npm run build && \
npm test && \
echo "✅ Ready to commit"
```

## Decision Matrix

### Status Determination

**✅ Ready for PR/Commit if:**
- 0 critical issues (🔴)
- Build succeeds
- All tests pass
- Changes match requirements

**⚠️ Issues to Address if:**
- 1-3 warnings (🟠)
- Minor test failures (non-critical)
- Recommendations to consider

**🔴 Not Ready if:**
- Any critical issues (🔴)
- Build fails
- Test failures in core functionality
- Security vulnerabilities
- AI conversion errors (design fidelity critical)

## Post-Preflight Actions

### If Issues Found
1. Fix critical issues (🔴) first
2. Fix warnings (🟠) if time permits
3. Document recommendations (🟡) as follow-up issues
4. Re-run relevant agents to verify fixes
5. Re-run preflight when ready

### If All Clear
1. Bump version if needed: `npm version [patch|minor|major]`
2. Stage changes: `git add .`
3. Commit with descriptive message
4. Push or create PR

### For Production Deployment
1. Run preflight ✅
2. Final manual test on staging URL
3. Verify `noindex` removed
4. Verify contact form works
5. Test on multiple devices
6. Deploy to production
7. Verify production deployment
8. Test critical paths on live site

---

**Remember**: Preflight is comprehensive but not perfect. Use judgment. If something feels wrong, investigate even if agents don't flag it.
