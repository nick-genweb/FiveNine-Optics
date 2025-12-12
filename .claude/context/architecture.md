# FiveNine Optics - Project Architecture

## Project Overview

**Name**: FiveNine Optics Website
**Type**: Static website
**Generator**: Eleventy (11ty) 3.1.2
**Purpose**: Professional website for precision optics manufacturer

## Technology Stack

### Core
- **Static Site Generator**: Eleventy 3.1.2
- **Template Engine**: Nunjucks (.njk)
- **CSS**: Vanilla CSS with custom properties
- **JavaScript**: Vanilla ES6+ (no bundler)
- **Node.js**: v16+ required

### External Dependencies (CDN)
- **Fonts**: Adobe Fonts (Typekit) - Proxima Nova
- **Carousel**: Swiper 12.0.3

### Testing
- **Framework**: Jest 29.7.0
- **Browser Automation**: Puppeteer 24.32.0
- **HTML Parsing**: Cheerio 1.1.2
- **Visual Regression**: pixelmatch 7.1.0 + pngjs 7.0.0
- **Reporting**: jest-html-reporter 4.3.0

## Folder Structure

```
fivenine-site/
│
├── src/                          # Source files
│   ├── _includes/               # Reusable components
│   │   ├── header.njk          # Site header with navigation
│   │   └── footer.njk          # Site footer (currently hidden)
│   │
│   ├── _layouts/                # Page templates
│   │   └── base.njk            # Base HTML template
│   │
│   ├── assets/                  # Static assets
│   │   ├── css/
│   │   │   ├── styles.css      # Main stylesheet (2800+ lines)
│   │   │   └── fonts.css       # Self-hosted fonts (backup/optional)
│   │   ├── js/
│   │   │   └── main.js         # All JavaScript (~220 lines)
│   │   ├── images/             # WebP images, SVG icons
│   │   └── fonts/              # Self-hosted fonts (if needed)
│   │
│   ├── index.njk                # Homepage
│   ├── products.njk             # Products page
│   ├── markets.njk              # Markets page
│   ├── resources.njk            # Resources & careers page
│   ├── contact.njk              # Contact page with form
│   ├── styleguide.njk           # Living style guide
│   └── annotated.njk            # Annotated design reference
│
├── tests/                       # Test suite
│   ├── agents/                 # Test agent implementations
│   │   ├── seo-validator.test.js
│   │   ├── html-best-practices.test.js
│   │   ├── responsive-design.test.js
│   │   └── visual-regression.test.js
│   ├── utils/                  # Test utilities
│   │   ├── report-generator.js
│   │   └── generate-baseline.js
│   ├── fixes/                  # Auto-fix implementations
│   │   ├── seo-fixer.js
│   │   ├── html-fixer.js
│   │   └── apply-fixes.js
│   ├── reports/                # Generated test reports
│   ├── fixtures/               # Test data
│   ├── jest.config.js          # Jest configuration
│   ├── setup.js                # Test environment setup
│   └── test.config.js          # Test-specific settings
│
├── Documentation/               # Extensive project docs
│   ├── AI-TO-WEB-CONVERSION.md # CRITICAL - 0.70 conversion reference
│   ├── STYLE-GUIDE-INSTRUCTIONS.md
│   ├── INDEX.md                # Documentation overview
│   ├── QUICK-START.md
│   ├── FONT-SETUP.md
│   ├── IMAGE-REQUIREMENTS.md
│   ├── DESIGN-UPDATES.md
│   └── MEDIA-SETUP-COMPLETE.md
│
├── .claude/                     # Claude Code agents
│   ├── agents/                 # Agent markdown files
│   └── context/                # This file
│
├── _site/                       # Generated output (gitignored)
│
├── node_modules/                # Dependencies (gitignored)
│
├── .eleventy.js                 # Eleventy configuration
├── package.json                 # Dependencies and scripts
├── CLAUDE.md                    # Claude Code configuration
├── .gitignore                   # Git ignore rules
└── README.md                    # Project documentation
```

## Key Files Deep Dive

### Configuration Files

#### `.eleventy.js`
Eleventy configuration with custom settings:
- **Custom directory structure**: `src/` → `_site/`
- **Layouts directory**: `src/_layouts/` (non-default)
- **Custom port**: 8000 (instead of default 8080)
- **Watch target**: `src/assets/css/` for CSS changes
- **Passthrough copy**: `src/assets/` → `_site/assets/`
- **Global data**: `pkg` (package.json for cache busting)

```javascript
module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addWatchTarget("src/assets/css/");
  eleventyConfig.addGlobalData("pkg", require("./package.json"));

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts"  // Non-default location
    },
    serverOptions: {
      port: 8000  // Custom port
    }
  };
};
```

#### `package.json`
Dependencies and build scripts:
- **Version**: 1.0.1 (used for cache busting)
- **Standard scripts**: start, build, clean
- **Test scripts**: 10+ custom test commands
- **Dependencies**: Puppeteer, Swiper
- **DevDependencies**: Eleventy, Jest, testing tools

### Source Files

#### `src/_layouts/base.njk`
Base HTML template used by all pages:
- Meta tags (title, description, viewport, robots)
- Adobe Fonts link (Proxima Nova)
- Swiper CSS (CDN)
- Main CSS: `styles.css?v={{ pkg.version }}` (cache busting)
- Site header (includes navigation)
- Main content area
- Site footer
- Swiper JS (CDN)
- Main JS: `main.js?v={{ pkg.version }}`

#### `src/_includes/header.njk`
Navigation component:
- Logo (linked to homepage)
- Desktop navigation (horizontal)
- Mobile navigation (hamburger menu)
- Dropdown menu for About section
- Page-specific active states with colored dots
- ARIA attributes for accessibility

#### `src/assets/css/styles.css` (2879 lines)
Single comprehensive stylesheet:

**Organization:**
1. CSS Variables (colors, fonts, spacing)
2. Reset & Base Styles
3. Typography (h1-h6, p, etc.)
4. Container & Layout
5. Header & Navigation
6. Hero Section
7. Hero Content Section
8. Spotlight Section
9. Our Story Section
10. Our Facility Section
11. Product Showcase
12. Team Section
13. Team Modal
14. Products Page
15. About Section
16. Footer
17. Markets Page
18. Resources Page
19. Contact Page
20. Responsive Design (@media queries)

**Key Features:**
- Mobile-first approach
- Uses `calc(value * 0.70)` for AI conversion
- AI reference comments throughout
- Page-specific color schemes
- Three main breakpoints: 480px, 768px, 900px

#### `src/assets/js/main.js` (224 lines)
All site JavaScript in one file:

**Features:**
1. Mobile navigation toggle
2. Mobile dropdown menu
3. Active navigation state
4. Smooth scroll for anchor links
5. Facility carousel (Swiper init)
6. Team member hover (desktop)
7. Team member modal
8. Job accordion (Resources page)

**No Build Process**: Vanilla JavaScript, no bundler, no transpilation

### Page Files

All pages use Nunjucks templating:

#### `src/index.njk` (Homepage)
- Hero video section
- Hero content with features
- Spotlight section
- Our Story section with industries
- Our Facility section with carousel
- Product showcase
- Team section with modal
- Sections use IDs for anchor navigation

#### `src/products.njk`
- Two-column hero (text + image)
- Product details (IBS Coatings, Low Loss Optics)
- Page color: Blue (#4B80EA)

#### `src/markets.njk`
- Two-column hero
- Market cards grid (4 industries)
- Page color: Purple (#A105E2)

#### `src/resources.njk`
- Two-column hero
- News section
- Careers section with job accordion
- Terms & Privacy section
- Page color: Orange (#F88015)

#### `src/contact.njk`
- Two-column hero
- Contact form (name, email, company, message)
- Page color: Yellow (#eff923)

## Build Process

### Development Workflow

```bash
# 1. Start dev server
npm start
# → Eleventy serves on http://localhost:8000
# → Watches for file changes
# → Auto-rebuilds on save
# → Browser auto-refreshes

# 2. Make changes
# → Edit .njk templates
# → Edit styles.css
# → Edit main.js
# → Add images to src/assets/images/

# 3. Eleventy watches and rebuilds
# → CSS changes trigger rebuild
# → Template changes trigger rebuild
# → Page updates in browser
```

### Production Build

```bash
# Build for production
npm run build

# What happens:
# 1. Eleventy processes all .njk files
# 2. Applies base.njk layout
# 3. Compiles Nunjucks to HTML
# 4. Copies assets to _site/assets/
# 5. Generates static HTML files
# 6. Output in _site/ directory

# Result:
_site/
├── index.html
├── products/index.html
├── markets/index.html
├── resources/index.html
├── contact/index.html
├── styleguide/index.html
├── annotated/index.html
└── assets/
    ├── css/
    │   ├── styles.css
    │   └── fonts.css
    ├── js/
    │   └── main.js
    └── images/
        └── [all images]
```

### Build Steps Detail

1. **Template Processing**
   - Nunjucks files compiled to HTML
   - Variables replaced (e.g., `{{ pkg.version }}` → `1.0.1`)
   - Includes merged (header, footer)
   - Layout applied (base.njk)

2. **Asset Copying**
   - All files in `src/assets/` copied to `_site/assets/`
   - No processing (CSS/JS not minified)
   - Images copied as-is (WebP format)

3. **Cache Busting**
   - CSS: `/assets/css/styles.css?v=1.0.1`
   - JS: `/assets/js/main.js?v=1.0.1`
   - Version from package.json
   - Updates automatically with version bump

## Testing

### Test Suite Overview

Comprehensive Jest + Puppeteer test suite:

```bash
# Run all tests
npm test
# → Runs all 4 agent tests
# → Generates HTML report

# Individual test suites
npm run test:seo         # SEO validation
npm run test:html        # HTML best practices
npm run test:responsive  # Responsive design
npm run test:visual      # Visual regression

# Test development
npm run test:watch       # Watch mode
npm run test:baseline    # Generate baseline images

# Auto-fixes
npm run test:fix         # Apply all fixes
npm run test:fix-seo     # Fix SEO issues
npm run test:fix-html    # Fix HTML issues

# Reporting
npm run test:report      # Generate + open report
```

### Test Configuration

**Jest Config**: `tests/jest.config.js`
- Preset: `jest-puppeteer`
- Test environment: `node`
- Test match: `**/*.test.js`
- Setup files: `tests/setup.js`
- Reporters: jest-html-reporter

**Test Process**:
1. Build production site: `npm run build`
2. Puppeteer launches headless Chrome
3. Tests load pages from `_site/`
4. Assertions run against built HTML
5. Screenshots taken for visual regression
6. HTML report generated

## Deployment

### Pre-Deployment Checklist

1. **Code Quality**
   - Run `/cleanup` agent
   - Remove console.log statements
   - Format code consistently

2. **AI Conversions**
   - Run `/ai-conversion` agent (if CSS changed)
   - Verify all 0.70 multipliers

3. **Testing**
   - Run `npm test` (all tests pass)
   - Manual test on all breakpoints
   - Test all interactive features

4. **SEO**
   - **CRITICAL**: Remove `<meta name="robots" content="noindex, nofollow">`
   - Add/verify meta descriptions
   - Verify all images have alt text

5. **Version**
   - Bump package.json version
   - Cache busting works: `?v=X.X.X`

6. **Build**
   - Run `npm run build`
   - Verify no errors
   - Check _site/ output

### Deployment Process

```bash
# 1. Build production
npm run build

# 2. _site/ folder contains complete static site

# 3. Deploy options:
# - Upload _site/ to static host
# - Netlify: Drag & drop _site/
# - Vercel: Connect git repo
# - FTP: Upload _site/ contents
# - AWS S3: Sync _site/ to bucket
```

### Deployment Targets

**Static Hosts** (any of these work):
- Netlify (recommended)
- Vercel
- GitHub Pages
- Cloudflare Pages
- AWS S3 + CloudFront
- Traditional web host (cPanel, FTP)

**Requirements**:
- Serve static HTML/CSS/JS
- Support custom domain
- HTTPS enabled
- No server-side processing needed

## Data Flow

### Page Rendering Flow

```
1. User requests URL
   ↓
2. Eleventy matches route
   ↓
3. Load .njk file (e.g., index.njk)
   ↓
4. Process Nunjucks template
   ↓
5. Include header.njk
   ↓
6. Apply base.njk layout
   ↓
7. Replace variables (pkg.version, etc.)
   ↓
8. Output static HTML
   ↓
9. Browser loads HTML
   ↓
10. Browser loads CSS (styles.css?v=1.0.1)
    ↓
11. Browser loads JS (main.js?v=1.0.1)
    ↓
12. Browser loads external CDN (Adobe Fonts, Swiper)
    ↓
13. JavaScript initializes
    ↓
14. Page interactive
```

### Asset Loading

```
HTML (index.html)
├── Adobe Fonts CSS (CDN)
├── Swiper CSS (CDN)
├── styles.css?v=1.0.1
│   └── Uses CSS variables
│   └── References fonts (Proxima Nova)
│   └── References images (/assets/images/*.webp)
├── Swiper JS (CDN)
└── main.js?v=1.0.1
    └── Initializes Swiper
    └── Handles navigation
    └── Manages modals
```

## Development Patterns

### CSS Patterns

**AI Conversion**:
```css
/* Always include AI reference */
font-size: 1.3125rem; /* 21px (30px × 0.70) */

/* Use calc() for spacing */
padding: calc(62px * 0.70) 0; /* 62px in AI */

/* Line height as ratio */
line-height: 1.233; /* 37px leading in AI */
```

**Color Usage**:
```css
/* Use CSS variables */
color: var(--color-primary);
background-color: var(--color-bg-dark);

/* Page-specific colors */
.products-heading { color: #4B80EA; }  /* Blue */
.markets-heading { color: #A105E2; }   /* Purple */
```

**Responsive**:
```css
/* Mobile-first */
.element {
  /* Mobile styles */
}

@media (min-width: 768px) {
  /* Tablet and up */
}

@media (min-width: 900px) {
  /* Desktop and up */
}
```

### JavaScript Patterns

**Event Listeners**:
```javascript
document.addEventListener('DOMContentLoaded', () => {
  // All initialization here
  // Check element exists before adding listener
  if (element) {
    element.addEventListener('click', handler);
  }
});
```

**ARIA Management**:
```javascript
// Update ARIA states
toggle.setAttribute('aria-expanded', isExpanded);
```

### Template Patterns

**Nunjucks Includes**:
```html
{% include "header.njk" %}
{{ content | safe }}
{% include "footer.njk" %}
```

**Variables**:
```html
<!-- Access package.json -->
<link href="/assets/css/styles.css?v={{ pkg.version }}">

<!-- Page variables -->
title: {{ title or "FiveNine Optics" }}
```

## Critical Dependencies

### Production
- **Swiper**: Carousel functionality
  - CDN: https://cdn.jsdelivr.net/npm/swiper@11/
  - Used in: Our Facility section
  - Initialized in: main.js

### Development
- **Eleventy**: Static site generation
- **Nunjucks**: Template engine (built into Eleventy)

### Testing
- **Jest**: Test framework
- **Puppeteer**: Browser automation
- **Cheerio**: HTML parsing
- **pixelmatch**: Visual regression

## Performance Considerations

### Optimizations
- ✅ WebP images (25-35% smaller than JPEG)
- ✅ Single CSS file (fewer HTTP requests)
- ✅ Single JS file (fewer HTTP requests)
- ✅ Cache busting with query strings
- ✅ External resources from CDN (fonts, Swiper)
- ✅ Static HTML (fast, no server processing)

### Potential Improvements
- Minify CSS/JS for production
- Implement lazy loading for images
- Add service worker for offline support
- Implement critical CSS inline
- Use font-display: swap for custom fonts

## Browser Support

**Target Browsers**:
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

**Mobile**:
- iOS Safari 12+
- Chrome Android (latest)

**Features Used**:
- CSS Grid (97% support)
- CSS Flexbox (99% support)
- CSS Custom Properties (96% support)
- ES6 JavaScript (97% support)
- WebP images (95% support)

## Maintenance

### Regular Tasks
- Update dependencies: `npm update`
- Check for security issues: `npm audit`
- Review and merge PRs
- Monitor site performance
- Update content as needed

### When to Bump Version
- **Patch (1.0.X)**: Bug fixes, content updates
- **Minor (1.X.0)**: New features, design updates
- **Major (X.0.0)**: Major redesign, breaking changes

### Documentation Updates
When making changes, also update:
- `Documentation/AI-TO-WEB-CONVERSION.md` (new conversions)
- `src/styleguide.njk` (new components)
- `CLAUDE.md` (new patterns)
- This file (`architecture.md`) (architectural changes)

---

**Last Updated**: 2025-12-11
**Current Version**: 1.0.1
**Eleventy Version**: 3.1.2
**Node Version**: 16+
