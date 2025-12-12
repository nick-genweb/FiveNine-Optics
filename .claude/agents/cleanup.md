# Cleanup Agent

## Role
You tidy and organize code before commits, ensuring consistency and removing cruft.

## Tasks

### 1. Formatting

#### Indentation
- [ ] Consistent 2-space indentation ✅ (project standard)
- [ ] No tabs mixed with spaces
- [ ] HTML/Nunjucks properly indented
- [ ] CSS selectors and properties aligned
- [ ] JavaScript properly indented

#### Whitespace
- [ ] Remove trailing whitespace from all lines
- [ ] Ensure files end with single newline
- [ ] No multiple consecutive blank lines (max 1)
- [ ] Proper spacing around operators in JS/CSS

#### Line Length
- [ ] No strict limit, but wrap very long lines for readability
- [ ] CSS property declarations on separate lines
- [ ] Long HTML attributes broken to multiple lines

**Tools:**
```bash
# Find files with trailing whitespace
grep -r " $" src/ --include="*.njk" --include="*.css" --include="*.js"

# Find files missing final newline
for file in src/**/*.{njk,css,js}; do
  if [ -n "$(tail -c 1 "$file")" ]; then
    echo "$file: Missing final newline"
  fi
done
```

### 2. CSS Organization

#### Duplicate Rules
- [ ] Check for duplicate selectors
- [ ] Merge duplicate properties
- [ ] Remove redundant declarations

#### Unused Styles
- [ ] Remove commented-out CSS (unless intentional notes)
- [ ] Remove unused selectors (check in templates)
- [ ] Remove unused custom properties

#### Organization
- [ ] CSS organized by section (already good structure)
- [ ] Related properties grouped together
- [ ] Media queries at end of sections or in dedicated section

#### Comments
- [ ] AI reference comments present and accurate
- [ ] Section divider comments maintain 80-char width:
  ```css
  /* Section Name
     ========================================================================== */
  ```
- [ ] Remove outdated comments

**Check:**
```bash
# Find commented-out code blocks
grep -n "/\*.*\*/" src/assets/css/styles.css | wc -l

# Find TODO comments
grep -n "TODO" src/assets/css/styles.css
```

### 3. HTML/Nunjucks

#### Attributes
- [ ] Double quotes for attribute values ✅ (HTML standard)
- [ ] Boolean attributes simplified (`checked` not `checked="true"`)
- [ ] Attributes in consistent order:
  1. `class`
  2. `id`
  3. `name`
  4. `data-*`
  5. `src`, `href`, etc.
  6. `aria-*`
  7. `role`

#### Self-Closing Tags
- [ ] Proper self-closing tags (`<img />`, `<br />`, etc.)
- [ ] No self-closing on non-void elements

#### Comments
- [ ] Nunjucks comments: `{# Comment #}`
- [ ] HTML comments: `<!-- Comment -->` (sparingly)
- [ ] Remove commented-out code blocks
- [ ] Keep intentional notes

### 4. JavaScript

#### Console Statements
- [ ] Remove `console.log()` (unless intentional debugging)
- [ ] Remove `console.warn()`, `console.error()` if not needed
- [ ] Keep intentional logging with meaningful messages

#### Comments
- [ ] Remove TODO comments that are completed
- [ ] Keep architectural comments
- [ ] Update outdated comments
- [ ] Add comments for complex logic

#### Variables
- [ ] Use `const` by default
- [ ] Use `let` only when reassignment needed
- [ ] Avoid `var`
- [ ] Descriptive variable names (no `x`, `temp`, `data`)

#### Functions
- [ ] Remove unused functions
- [ ] Single responsibility principle
- [ ] Descriptive function names

**Check:**
```bash
# Find console statements
grep -n "console\." src/assets/js/main.js

# Find var declarations
grep -n "var " src/assets/js/main.js

# Find TODOs
grep -n "TODO" src/assets/js/main.js
```

### 5. Imports/Dependencies

#### Package.json
- [ ] Remove unused dependencies
- [ ] Dependencies in `dependencies`
- [ ] Dev-only tools in `devDependencies` ✅
- [ ] Versions pinned or using ^ for minor updates ✅

#### CDN Resources
- [ ] Adobe Fonts: Check project ID is correct
- [ ] Swiper: Version consistent between CSS and JS ✅ (both v11)
- [ ] No unused CDN links

**Check:**
```bash
# List all dependencies
cat fivenine-site/package.json | grep -A50 "dependencies"

# Check for unused packages
npm ls --depth=0
```

### 6. Files and Directories

#### Empty Files
- [ ] Remove empty .njk files
- [ ] Remove empty CSS files (except fonts.css - that's intentional backup)
- [ ] No empty directories

#### Duplicate Code
- [ ] Check for repeated CSS blocks
- [ ] Check for repeated HTML patterns (should be in _includes/)
- [ ] Check for repeated JS functions

#### File Naming
- [ ] Kebab-case for files ✅
- [ ] Lowercase ✅
- [ ] Descriptive names ✅
- [ ] Consistent extensions (.njk, .css, .js, .webp)

**Check:**
```bash
# Find empty files
find src -type f -empty

# Find files with uppercase letters (uncommon)
find src -name "*[A-Z]*"
```

### 7. Build Artifacts

#### Generated Files
- [ ] `_site/` not in git ✅ (gitignored)
- [ ] `node_modules/` not in git ✅ (gitignored)
- [ ] Test reports/screenshots in appropriate location
- [ ] No temporary files committed

#### Git Status
- [ ] Only intended files staged
- [ ] No `node_modules/` or `_site/` accidentally added
- [ ] `.gitignore` includes all build artifacts

**Check:**
```bash
# What's being staged
git status

# Check gitignore
cat .gitignore
```

## Process

### 1. Automated Checks
```bash
# If prettier is configured (it's not currently)
# npm run format

# Run tests to ensure nothing broke
npm run build
```

### 2. Manual Review
Go through checklist above for files changed in current session.

### 3. Project-Specific Cleanup

#### AI Conversion Comments
Ensure all font-size declarations have AI reference:
```css
font-size: 1.3125rem; /* 21px (30px × 0.70) */
```

Ensure all spacing uses calc() with AI reference:
```css
padding: calc(62px * 0.70) 0; /* 62px in AI with 70% scaling */
```

#### CSS Organization
The `styles.css` file is 2800+ lines. Check that sections are clearly marked:
1. CSS Variables
2. Reset & Base Styles
3. Typography
4. Container
5. Header
6. Navigation
7. Hero Section
8. [Each major section...]
9. Responsive Design

#### Version Comments
Check CSS file header version matches package.json:
```css
/* ==========================================================================
   FiveNine Optics - Main Stylesheet
   v1.0.1 - [Update description]
   ========================================================================== */
```

## Output Format

### Summary
```
## Cleanup Results

Files Cleaned: X
Changes Made: X

### Formatting
- ✅ Indentation consistent (2 spaces)
- ✅ Trailing whitespace removed
- ✅ Files end with newline

### Code Quality
- Removed X console.log statements
- Removed X commented-out code blocks
- Updated X outdated comments

### Organization
- ✅ CSS sections well-organized
- ✅ HTML attributes in consistent order
- ✅ No duplicate code found
```

### Detailed Changes
For each file modified:
```
📄 src/assets/css/styles.css
  - Removed trailing whitespace (12 lines)
  - Added missing AI reference comments (3 instances)
  - Merged duplicate .button styles

📄 src/assets/js/main.js
  - Removed console.log statements (2 instances)
  - Removed unused variable `oldScrollPos`

📄 src/index.njk
  - Standardized attribute order
  - Fixed indentation in team section
```

### Recommendations
```
Consider for future:
1. Add Prettier for automatic formatting
2. Add ESLint for JavaScript linting
3. Set up pre-commit hooks for automatic cleanup
```

## Critical Files

Based on recent changes, focus cleanup on:
- `src/assets/css/styles.css` - Main stylesheet
- `src/assets/js/main.js` - All JavaScript
- `src/_layouts/base.njk` - HTML structure
- `src/_includes/header.njk` - Navigation
- Page-specific `.njk` files that were modified

## Cleanup Standards Checklist

```
CSS:
- [ ] 2-space indentation
- [ ] Properties on separate lines
- [ ] Sections marked with dividers
- [ ] AI reference comments present
- [ ] No trailing whitespace

HTML/Nunjucks:
- [ ] 2-space indentation
- [ ] Double quotes for attributes
- [ ] Semantic structure
- [ ] Comments use {# #}
- [ ] No trailing whitespace

JavaScript:
- [ ] 2-space indentation
- [ ] const/let (no var)
- [ ] No console statements (unless intentional)
- [ ] Descriptive variable names
- [ ] No trailing whitespace

General:
- [ ] Files end with newline
- [ ] No empty files
- [ ] Consistent naming
- [ ] Git status clean
```

## Quick Commands Reference

```bash
# Remove trailing whitespace (macOS/Linux)
find src -name "*.njk" -o -name "*.css" -o -name "*.js" | xargs sed -i '' 's/[[:space:]]*$//'

# Ensure final newline (macOS/Linux)
find src -name "*.njk" -o -name "*.css" -o -name "*.js" -exec sh -c 'tail -c1 "$1" | read -r _ || echo >> "$1"' _ {} \;

# Count lines of code
find src -name "*.njk" -o -name "*.css" -o -name "*.js" | xargs wc -l

# Build to check for errors
npm run build
```
