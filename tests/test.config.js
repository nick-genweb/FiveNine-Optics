/**
 * Central configuration for all FiveNine Optics testing agents
 */

module.exports = {
  // Base URL for testing
  baseUrl: process.env.TEST_URL || 'http://localhost:8081',

  // Pages to test
  pages: [
    { name: 'Home', path: '/', slug: 'index' },
    { name: 'Markets', path: '/markets/', slug: 'markets' },
    { name: 'Products', path: '/products/', slug: 'products' },
    { name: 'Resources', path: '/resources/', slug: 'resources' },
    { name: 'Contact', path: '/contact/', slug: 'contact' },
    { name: 'Style Guide', path: '/styleguide/', slug: 'styleguide' },
    { name: 'Annotated', path: '/annotated/', slug: 'annotated' },
  ],

  // Viewport configurations for responsive testing
  viewports: {
    mobile: { width: 375, height: 812, name: 'Mobile' },
    tablet: { width: 768, height: 1024, name: 'Tablet' },
    laptop: { width: 1024, height: 768, name: 'Laptop' },
    desktop: { width: 1440, height: 900, name: 'Desktop' },
    wide: { width: 1920, height: 1080, name: 'Wide Desktop' },
  },

  // Visual regression settings
  visualRegression: {
    threshold: 0.01, // 1% pixel difference tolerance
    includeAA: true, // Include anti-aliasing differences
    alpha: 0.1, // Opacity of diff overlay
    diffDir: 'tests/reports/visual-diffs',
    referenceDir: 'tests/fixtures/reference-screenshots',
    actualDir: 'tests/reports/actual-screenshots',
  },

  // SEO validation rules
  seo: {
    requireSingleH1: true,
    requireH1OnEveryPage: true,
    allowSkippedLevels: false,
    maxHeadingLevel: 6,
    decorativeHeadings: [
      // Elements that should not be headings
      '.team-member h3', // Team member names
      '.market-card h3', // Industry icons
    ],
  },

  // HTML best practices rules
  html: {
    requireAltText: true,
    requireAriaLabels: true,
    requireSemanticHtml: true,
    requireUniqueMetaTags: true,
    requireFormLabels: true,
    minBodyFontSize: 16, // pixels
    semanticElements: ['header', 'main', 'footer', 'nav', 'section', 'article'],
  },

  // Responsive design rules
  responsive: {
    minTouchTargetSize: 44, // pixels (44x44)
    allowHorizontalScroll: false,
    testInteractiveElements: true,
    breakpoints: [768, 1024, 1440],
  },

  // Puppeteer settings
  puppeteer: {
    timeout: 30000,
    waitUntil: 'networkidle0',
    waitForAnimations: 1000, // ms to wait for animations
  },

  // Screenshot settings
  screenshot: {
    fullPage: true,
    type: 'png',
    encoding: 'binary',
  },

  // Auto-fix settings
  autoFix: {
    enabled: true,
    dryRun: false, // Preview changes without applying
    backupBeforeFix: true,
    fixableIssues: [
      'seo-heading-hierarchy',
      'missing-alt-text',
      'missing-meta-tags',
      'visual-regression-update',
    ],
  },

  // Reporting settings
  reporting: {
    outputDir: 'tests/reports',
    includeScreenshots: true,
    includeVisualDiffs: true,
    generateTimeline: true,
    openAfterTest: false,
  },
};
