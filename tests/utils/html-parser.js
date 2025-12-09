/**
 * HTML parsing and validation utilities using Cheerio
 */

const cheerio = require('cheerio');
const config = require('../test.config');

class HTMLParser {
  /**
   * Load HTML and return Cheerio instance
   */
  static load(html) {
    return cheerio.load(html);
  }

  /**
   * Extract heading hierarchy from HTML
   */
  static extractHeadingHierarchy(html) {
    const $ = cheerio.load(html);
    const headings = [];

    $('h1, h2, h3, h4, h5, h6').each((index, element) => {
      const $el = $(element);
      const tag = element.tagName.toLowerCase();
      const level = parseInt(tag.substring(1));

      headings.push({
        index,
        tag,
        level,
        text: $el.text().trim(),
        id: $el.attr('id') || null,
        classes: $el.attr('class')?.split(' ').filter(Boolean) || [],
        parent: element.parent?.tagName?.toLowerCase() || null,
      });
    });

    return headings;
  }

  /**
   * Validate heading hierarchy
   */
  static validateHeadingHierarchy(html) {
    const headings = this.extractHeadingHierarchy(html);
    const issues = [];

    // Check for H1
    const h1Count = headings.filter((h) => h.level === 1).length;

    if (h1Count === 0 && config.seo.requireH1OnEveryPage) {
      issues.push({
        type: 'missing-h1',
        severity: 'error',
        message: 'Page is missing an H1 heading',
      });
    }

    if (h1Count > 1 && config.seo.requireSingleH1) {
      issues.push({
        type: 'multiple-h1',
        severity: 'error',
        message: `Page has ${h1Count} H1 headings (should have exactly one)`,
        h1Headings: headings.filter((h) => h.level === 1),
      });
    }

    // Check for skipped levels
    if (!config.seo.allowSkippedLevels) {
      for (let i = 1; i < headings.length; i++) {
        const current = headings[i];
        const previous = headings[i - 1];
        const levelJump = current.level - previous.level;

        if (levelJump > 1) {
          issues.push({
            type: 'skipped-level',
            severity: 'warning',
            message: `Heading level skipped: ${previous.tag} → ${current.tag}`,
            from: previous,
            to: current,
          });
        }
      }
    }

    // Check for decorative headings
    config.seo.decorativeHeadings.forEach((selector) => {
      const $ = cheerio.load(html);
      $(selector).each((index, element) => {
        const $el = $(element);
        issues.push({
          type: 'decorative-heading',
          severity: 'warning',
          message: `Decorative text using heading tag: ${selector}`,
          text: $el.text().trim(),
          selector,
        });
      });
    });

    return {
      passed: issues.filter((i) => i.severity === 'error').length === 0,
      headings,
      issues,
      h1Count,
    };
  }

  /**
   * Extract all images and validate alt text
   */
  static validateImages(html) {
    const $ = cheerio.load(html);
    const images = [];
    const issues = [];

    $('img').each((index, element) => {
      const $img = $(element);
      const src = $img.attr('src');
      const alt = $img.attr('alt');
      const hasAlt = $img.attr('alt') !== undefined;

      images.push({
        index,
        src,
        alt: alt || '',
        hasAlt,
        isEmpty: hasAlt && alt.trim() === '',
      });

      if (!hasAlt && config.html.requireAltText) {
        issues.push({
          type: 'missing-alt',
          severity: 'error',
          message: `Image missing alt attribute: ${src}`,
          src,
        });
      } else if (hasAlt && alt.trim() === '' && config.html.requireAltText) {
        issues.push({
          type: 'empty-alt',
          severity: 'warning',
          message: `Image has empty alt attribute: ${src}`,
          src,
        });
      }
    });

    return {
      passed: issues.filter((i) => i.severity === 'error').length === 0,
      images,
      issues,
      totalImages: images.length,
      missingAlt: images.filter((img) => !img.hasAlt).length,
    };
  }

  /**
   * Validate semantic HTML structure
   */
  static validateSemanticHTML(html) {
    const $ = cheerio.load(html);
    const structure = {};
    const issues = [];

    config.html.semanticElements.forEach((tag) => {
      const elements = $(tag);
      structure[tag] = {
        count: elements.length,
        exists: elements.length > 0,
      };

      if (elements.length === 0 && config.html.requireSemanticHtml) {
        issues.push({
          type: 'missing-semantic-element',
          severity: 'warning',
          message: `Page is missing <${tag}> element`,
          element: tag,
        });
      }
    });

    return {
      passed: issues.filter((i) => i.severity === 'error').length === 0,
      structure,
      issues,
    };
  }

  /**
   * Validate form accessibility
   */
  static validateForms(html) {
    const $ = cheerio.load(html);
    const formElements = [];
    const issues = [];

    $('input, textarea, select').each((index, element) => {
      const $el = $(element);
      const id = $el.attr('id');
      const name = $el.attr('name');
      const type = $el.attr('type') || element.tagName.toLowerCase();
      const ariaLabel = $el.attr('aria-label');
      const placeholder = $el.attr('placeholder');

      let hasLabel = false;
      let labelText = null;

      if (id) {
        const $label = $(`label[for="${id}"]`);
        hasLabel = $label.length > 0;
        labelText = $label.text().trim();
      }

      formElements.push({
        index,
        type,
        id,
        name,
        hasLabel,
        labelText,
        ariaLabel,
        placeholder,
      });

      if (!hasLabel && !ariaLabel && config.html.requireFormLabels) {
        issues.push({
          type: 'missing-label',
          severity: 'error',
          message: `Form element missing label or aria-label: ${type}${id ? ` (id="${id}")` : ''}`,
          element: {
            type,
            id,
            name,
          },
        });
      }
    });

    return {
      passed: issues.filter((i) => i.severity === 'error').length === 0,
      formElements,
      issues,
      totalFormElements: formElements.length,
      missingLabels: formElements.filter((el) => !el.hasLabel && !el.ariaLabel).length,
    };
  }

  /**
   * Extract and validate meta tags
   */
  static validateMetaTags(html) {
    const $ = cheerio.load(html);
    const meta = {
      title: $('title').text(),
      description: $('meta[name="description"]').attr('content'),
      viewport: $('meta[name="viewport"]').attr('content'),
      charset: $('meta[charset]').attr('charset'),
      ogTitle: $('meta[property="og:title"]').attr('content'),
      ogDescription: $('meta[property="og:description"]').attr('content'),
      ogImage: $('meta[property="og:image"]').attr('content'),
    };

    const issues = [];

    if (!meta.title || meta.title.trim() === '') {
      issues.push({
        type: 'missing-title',
        severity: 'error',
        message: 'Page is missing a title tag',
      });
    }

    if (!meta.description) {
      issues.push({
        type: 'missing-description',
        severity: 'warning',
        message: 'Page is missing a meta description',
      });
    }

    if (!meta.viewport) {
      issues.push({
        type: 'missing-viewport',
        severity: 'error',
        message: 'Page is missing viewport meta tag',
      });
    }

    return {
      passed: issues.filter((i) => i.severity === 'error').length === 0,
      meta,
      issues,
    };
  }

  /**
   * Validate links
   */
  static validateLinks(html) {
    const $ = cheerio.load(html);
    const links = [];
    const issues = [];

    $('a').each((index, element) => {
      const $link = $(element);
      const href = $link.attr('href');
      const text = $link.text().trim();
      const ariaLabel = $link.attr('aria-label');

      links.push({
        index,
        href,
        text,
        ariaLabel,
      });

      // Check for generic link text
      const genericTexts = ['click here', 'here', 'read more', 'more', 'link'];
      if (genericTexts.includes(text.toLowerCase()) && !ariaLabel) {
        issues.push({
          type: 'generic-link-text',
          severity: 'warning',
          message: `Link has generic text without aria-label: "${text}"`,
          href,
          text,
        });
      }

      // Check for empty links
      if (!text && !ariaLabel) {
        issues.push({
          type: 'empty-link',
          severity: 'warning',
          message: `Link has no text or aria-label: ${href}`,
          href,
        });
      }
    });

    return {
      passed: issues.filter((i) => i.severity === 'error').length === 0,
      links,
      issues,
      totalLinks: links.length,
    };
  }

  /**
   * Generate heading hierarchy tree visualization
   */
  static generateHeadingTree(headings) {
    let tree = '';
    let indentLevel = 0;

    headings.forEach((heading, index) => {
      const indent = '  '.repeat(heading.level - 1);
      tree += `${indent}${heading.tag.toUpperCase()}: ${heading.text}\n`;
    });

    return tree;
  }

  /**
   * Run all validations
   */
  static validateAll(html) {
    const results = {
      headingHierarchy: this.validateHeadingHierarchy(html),
      images: this.validateImages(html),
      semanticHTML: this.validateSemanticHTML(html),
      forms: this.validateForms(html),
      metaTags: this.validateMetaTags(html),
      links: this.validateLinks(html),
    };

    // Aggregate results
    const allIssues = Object.values(results).flatMap((r) => r.issues || []);
    const errorCount = allIssues.filter((i) => i.severity === 'error').length;
    const warningCount = allIssues.filter((i) => i.severity === 'warning').length;

    return {
      passed: errorCount === 0,
      results,
      summary: {
        totalIssues: allIssues.length,
        errors: errorCount,
        warnings: warningCount,
      },
    };
  }
}

module.exports = HTMLParser;
