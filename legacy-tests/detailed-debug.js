const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  
  await page.goto('http://localhost:8000/contact/', { waitUntil: 'networkidle0' });
  
  const details = await page.evaluate(() => {
    const formContainer = document.querySelector('.contact-form-container');
    const heroText = document.querySelector('.contact-hero-text');
    const heroContent = document.querySelector('.contact-hero-content');
    const heroImage = document.querySelector('.contact-hero-image');
    
    const getStyles = (el) => {
      if (!el) return null;
      const computed = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        position: computed.position,
        top: computed.top,
        bottom: computed.bottom,
        left: computed.left,
        right: computed.right,
        width: computed.width,
        height: computed.height,
        zIndex: computed.zIndex,
        rect: {
          top: rect.top,
          left: rect.left,
          bottom: rect.bottom,
          right: rect.right,
          width: rect.width,
          height: rect.height
        }
      };
    };
    
    return {
      formContainer: getStyles(formContainer),
      heroText: getStyles(heroText),
      heroContent: getStyles(heroContent),
      heroImage: getStyles(heroImage),
      formParent: formContainer?.parentElement?.className
    };
  });
  
  console.log(JSON.stringify(details, null, 2));
  
  await browser.close();
})();
