const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  
  await page.goto('http://localhost:8000/contact/', { waitUntil: 'networkidle0' });
  
  // Take screenshot
  await page.screenshot({ path: 'contact-current.png', fullPage: true });
  console.log('Screenshot saved to contact-current.png');
  
  // Get layout information
  const layoutInfo = await page.evaluate(() => {
    const heroContent = document.querySelector('.contact-hero-content');
    const heroText = document.querySelector('.contact-hero-text');
    const heroImage = document.querySelector('.contact-hero-image');
    const formContainer = document.querySelector('.contact-form-container');
    
    return {
      heroContent: heroContent ? heroContent.getBoundingClientRect() : null,
      heroText: heroText ? heroText.getBoundingClientRect() : null,
      heroImage: heroImage ? heroImage.getBoundingClientRect() : null,
      formContainer: formContainer ? formContainer.getBoundingClientRect() : null,
      heroContentStyle: heroContent ? window.getComputedStyle(heroContent).position : null,
      heroTextStyle: heroText ? window.getComputedStyle(heroText).position : null,
      formContainerStyle: formContainer ? window.getComputedStyle(formContainer).position : null,
    };
  });
  
  console.log('Layout Info:');
  console.log(JSON.stringify(layoutInfo, null, 2));
  
  await browser.close();
})();
