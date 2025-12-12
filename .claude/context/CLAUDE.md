# FiveNine Optics - Claude Code Configuration

## Project Overview
A professional Eleventy static website for FiveNine Optics, a precision optics manufacturer specializing in IBS coatings and low loss optics. Features responsive design with custom AI-to-web conversion workflow.

## Tech Stack
- **Static Site Generator**: Eleventy 3.1.2
- **Template Engine**: Nunjucks
- **CSS**: Vanilla CSS with custom properties (no framework)
- **JavaScript**: Vanilla ES6+ (no bundler)
- **Fonts**: Adobe Fonts (Proxima Nova via CDN)
- **Carousel**: Swiper 12.0.3 (CDN)
- **Testing**: Jest + Puppeteer (automated SEO, responsive, HTML, visual regression)
- **Image Format**: WebP
- **Build Tool**: Eleventy CLI
- **Node Version**: 16+

## Default Behavior
I operate in **dev mode** by default: focused on your immediate task, fast iterations. I'll flag obvious issues but won't run full audits unless asked.

---

## Smart Review System

**IMPORTANT:** When the user indicates a task is complete with phrases like:
- "done" / "that works" / "looks good" / "ready to commit"
- "approved" / "all approved" / "updates are approved"
- "everything looks good" / "ship it" / "LGTM"

**Immediately and automatically** present a review menu based on what was modified:
```
Ready to review? Based on what we worked on:

- [ ] 1. `/responsive` - [reason based on changes]
- [ ] 2. `/ada` - [reason based on changes]

Reply: numbers (1, 2), "all", "skip", or add extras (1, and /seo)
```

### Selection Handling
| Input | Action |
|-------|--------|
| `1` or `1, 3` | Run selected agents in sequence |
| `all` | Run all suggested agents |
| `skip` / `none` | Continue without review |
| `1, and /seo` | Run selected + additional agent |
| `/ada` (direct) | Run just that agent |

### Suggest Agents Based On
| Modified | Suggest |
|----------|---------|
| CSS, layouts, breakpoints, spacing | `/responsive` |
| Interactive elements, forms, modals, navigation | `/ada` |
| Meta tags, content, pages, titles | `/seo` |
| Multiple files, refactoring, major changes | `/cleanup` |
| AI conversion values, design implementation | `/ai-conversion` |

### After Running Agents
Present results grouped with issue counts. Offer to fix:
- "fix all"
- "fix 1, 3" (by issue number)
- "skip"

---

## Available Agents

| Command | File | Purpose |
|---------|------|---------|
| `/responsive` | `.claude/agents/responsive-testing.md` | Test all breakpoints and mobile behavior |
| `/ada` | `.claude/agents/ada-compliance.md` | WCAG 2.1 AA accessibility audit |
| `/seo` | `.claude/agents/seo-validation.md` | Meta tags, schema, performance |
| `/cleanup` | `.claude/agents/cleanup.md` | Format and organize code |
| `/ai-conversion` | `.claude/agents/ai-conversion-check.md` | Validate AI-to-web 0.70 conversions |
| `/preflight` | `.claude/agents/preflight.md` | Full PR preparation checklist |

---

## Available Commands

| Command | File | Purpose |
|---------|------|---------|
| `/commit` | `.claude/commands/commit.md` | Create commits with automatic version bumping for asset changes |

---

## Project Structure
```
fivenine-site/
├── src/
│   ├── _includes/         # Reusable components (header, footer)
│   ├── _layouts/          # Page templates (base.njk)
│   ├── assets/
│   │   ├── css/          # styles.css (2800+ lines), fonts.css
│   │   ├── js/           # main.js (navigation, modals, carousel)
│   │   ├── images/       # WebP images, SVG icons
│   │   └── fonts/        # Self-hosted fonts (optional)
│   ├── index.njk         # Homepage
│   ├── products.njk      # Products page
│   ├── markets.njk       # Markets page
│   ├── resources.njk     # Resources page
│   ├── contact.njk       # Contact page
│   ├── styleguide.njk    # Living style guide
│   └── annotated.njk     # Annotated design reference
├── tests/                # Jest + Puppeteer test suite
├── Documentation/        # Extensive project documentation
├── _site/               # Generated output (gitignored)
├── .eleventy.js         # Eleventy configuration
└── package.json         # Dependencies and scripts
```

## Build Commands
```bash
# Development
npm start                # Dev server on http://localhost:8000

# Production
npm run build           # Build to _site/
npm run clean           # Remove _site/

# Testing (existing Jest suite)
npm test                # Run all tests + report
npm run test:seo        # SEO validation
npm run test:responsive # Responsive design tests
npm run test:html       # HTML best practices
npm run test:visual     # Visual regression
npm run test:report     # Generate + open HTML report
```

## Code Standards
- **Indentation**: 2 spaces
- **Quotes**: Single quotes for JS, double quotes for HTML/Nunjucks
- **CSS**: BEM-inspired naming, mobile-first approach
- **Line Length**: No strict limit, prioritize readability
- **Comments**: Include AI reference values in CSS (e.g., `/* 21px (30px × 0.70) */`)
- **File Naming**: kebab-case for files, camelCase for JS variables
- **Image Format**: WebP for photos, SVG for icons/logos

## Critical Project Context

### AI-to-Web Conversion System
**CRITICAL**: All Adobe Illustrator designs use 70% UI scaling. Every measurement must be multiplied by 0.70:
- Font sizes: `AI px × 0.70 = Web px`
- Spacing: Use `calc(AIvalue * 0.70)` in CSS
- Line heights: Calculate as ratios (AI leading ÷ AI font size)

See: `Documentation/AI-TO-WEB-CONVERSION.md` for complete reference.

### Version Control & Cache Busting
- Package.json version is used for cache busting (`?v=1.0.1` on CSS/JS)
- Always bump version when modifying assets (patch/minor/major)
- **Use `/commit` command** - Automatically detects asset changes, prompts for version bump, creates commit, and optionally pushes

### Testing Philosophy
- Existing Jest suite tests production builds (`_site/`)
- Run `npm run build` before testing
- Visual regression uses baseline images
- Tests are comprehensive but can be slow

### Page-Specific Colors
Each page has a signature color (used in navigation dots and headings):
- Home/About: Cyan (#51F4EF)
- Products: Blue (#4B80EA)
- Markets: Purple (#A105E2)
- Resources: Orange (#F88015)
- Contact: Yellow (#eff923)

---

## Quick Reference

### Common Tasks
- **Add new page**: Create .njk in `src/`, add to navigation in `src/_includes/header.njk`
- **Update styles**: Edit `src/assets/css/styles.css`, remember 0.70 conversion
- **Add image**: Place in `src/assets/images/`, use WebP format
- **Test changes**: `npm start` → http://localhost:8000
- **Commit changes**: Use `/commit` command to create commits with automatic version bumping

### Key Files
- `src/_layouts/base.njk` - HTML structure, meta tags, asset loading
- `src/assets/css/styles.css` - All styles, organized by section
- `src/assets/js/main.js` - All JavaScript (navigation, modals, carousel)
- `.eleventy.js` - Eleventy config (custom port 8000, watch targets)
- `Documentation/AI-TO-WEB-CONVERSION.md` - Critical conversion reference ⭐

---

## Documentation
Extensive documentation exists in `Documentation/`:
- `AI-TO-WEB-CONVERSION.md` - Conversion formulas and reference tables ⭐
- `STYLE-GUIDE-INSTRUCTIONS.md` - How to maintain style guide
- `INDEX.md` - Documentation overview
- `QUICK-START.md` - Setup guide
- `FONT-SETUP.md` - Font configuration options

Also see: `11ty_sitebuild_knowledge/build-knowledge.md` for comprehensive build knowledge.

---

**Last Updated**: 2025-12-11
**Current Version**: 1.0.1
