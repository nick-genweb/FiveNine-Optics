/**
 * Puppeteer helper utilities for FiveNine Optics testing
 */

const config = require('../test.config');

class PuppeteerHelpers {
  /**
   * Navigate to a page and wait for it to load
   */
  static async navigateToPage(page, path) {
    const url = `${config.baseUrl}${path}`;
    await page.goto(url, {
      waitUntil: config.puppeteer.waitUntil,
      timeout: config.puppeteer.timeout,
    });

    // Wait for animations to complete
    if (config.puppeteer.waitForAnimations) {
      await page.waitForTimeout(config.puppeteer.waitForAnimations);
    }

    return url;
  }

  /**
   * Set viewport to specific size
   */
  static async setViewport(page, viewportName) {
    const viewport = config.viewports[viewportName];
    if (!viewport) {
      throw new Error(`Viewport "${viewportName}" not found in config`);
    }

    await page.setViewport({
      width: viewport.width,
      height: viewport.height,
    });

    return viewport;
  }

  /**
   * Take a screenshot with consistent settings
   */
  static async takeScreenshot(page, filepath) {
    await page.screenshot({
      path: filepath,
      ...config.screenshot,
    });

    return filepath;
  }

  /**
   * Get all headings from the page
   */
  static async getHeadings(page) {
    return await page.evaluate(() => {
      const headings = [];
      const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

      headingElements.forEach((heading) => {
        headings.push({
          tag: heading.tagName.toLowerCase(),
          level: parseInt(heading.tagName.substring(1)),
          text: heading.textContent.trim(),
          id: heading.id || null,
          classes: Array.from(heading.classList),
        });
      });

      return headings;
    });
  }

  /**
   * Get page HTML
   */
  static async getPageHTML(page) {
    return await page.content();
  }

  /**
   * Check if element exists on page
   */
  static async elementExists(page, selector) {
    const element = await page.$(selector);
    return element !== null;
  }

  /**
   * Get computed style for an element
   */
  static async getComputedStyle(page, selector, property) {
    return await page.evaluate(
      (sel, prop) => {
        const element = document.querySelector(sel);
        if (!element) return null;

        const styles = window.getComputedStyle(element);
        return prop ? styles[prop] : Object.assign({}, styles);
      },
      selector,
      property
    );
  }

  /**
   * Get all images and their alt text
   */
  static async getImages(page) {
    return await page.evaluate(() => {
      const images = [];
      const imgElements = document.querySelectorAll('img');

      imgElements.forEach((img) => {
        images.push({
          src: img.src,
          alt: img.alt || '',
          width: img.width,
          height: img.height,
          hasAlt: img.hasAttribute('alt'),
        });
      });

      return images;
    });
  }

  /**
   * Get all links from the page
   */
  static async getLinks(page) {
    return await page.evaluate(() => {
      const links = [];
      const linkElements = document.querySelectorAll('a');

      linkElements.forEach((link) => {
        links.push({
          href: link.href,
          text: link.textContent.trim(),
          ariaLabel: link.getAttribute('aria-label'),
          target: link.target || null,
        });
      });

      return links;
    });
  }

  /**
   * Get all form elements and their labels
   */
  static async getFormElements(page) {
    return await page.evaluate(() => {
      const forms = [];
      const formElements = document.querySelectorAll('input, textarea, select');

      formElements.forEach((element) => {
        const id = element.id;
        const label = id ? document.querySelector(`label[for="${id}"]`) : null;

        forms.push({
          type: element.type || element.tagName.toLowerCase(),
          id: id || null,
          name: element.name || null,
          hasLabel: label !== null,
          labelText: label ? label.textContent.trim() : null,
          ariaLabel: element.getAttribute('aria-label'),
          placeholder: element.placeholder || null,
        });
      });

      return forms;
    });
  }

  /**
   * Get page meta tags
   */
  static async getMetaTags(page) {
    return await page.evaluate(() => {
      const meta = {};
      const metaTags = document.querySelectorAll('meta');

      metaTags.forEach((tag) => {
        const name = tag.getAttribute('name') || tag.getAttribute('property');
        const content = tag.getAttribute('content');
        if (name && content) {
          meta[name] = content;
        }
      });

      meta.title = document.title;

      return meta;
    });
  }

  /**
   * Check if page has horizontal scroll
   */
  static async hasHorizontalScroll(page) {
    return await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
  }

  /**
   * Get all interactive elements and their sizes (for touch target validation)
   */
  static async getInteractiveElements(page) {
    return await page.evaluate(() => {
      const elements = [];
      const selectors = 'a, button, input, select, textarea, [role="button"], [onclick]';
      const interactiveElements = document.querySelectorAll(selectors);

      interactiveElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        elements.push({
          tag: element.tagName.toLowerCase(),
          text: element.textContent.trim().substring(0, 50),
          width: rect.width,
          height: rect.height,
          meetsMinSize: rect.width >= 44 && rect.height >= 44,
          classes: Array.from(element.classList),
        });
      });

      return elements;
    });
  }

  /**
   * Get semantic HTML structure
   */
  static async getSemanticStructure(page) {
    return await page.evaluate(() => {
      const structure = {};
      const semanticElements = ['header', 'main', 'footer', 'nav', 'section', 'article', 'aside'];

      semanticElements.forEach((tag) => {
        const elements = document.querySelectorAll(tag);
        structure[tag] = {
          count: elements.length,
          exists: elements.length > 0,
        };
      });

      return structure;
    });
  }

  /**
   * Wait for page to be fully loaded including fonts
   */
  static async waitForPageReady(page) {
    await page.evaluate(() => {
      return Promise.all([
        document.fonts.ready,
        new Promise((resolve) => {
          if (document.readyState === 'complete') {
            resolve();
          } else {
            window.addEventListener('load', resolve);
          }
        }),
      ]);
    });
  }
}

module.exports = PuppeteerHelpers;
