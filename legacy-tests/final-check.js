const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  
  await page.goto('http://localhost:8000/contact/', { waitUntil: 'networkidle0' });
  
  // Take full page screenshot
  await page.screenshot({ path: 'contact-final.png', fullPage: true });
  
  // Get final measurements
  const final = await page.evaluate(() => {
    const form = document.querySelector('.contact-form-container');
    const image = document.querySelector('.contact-hero-image img');
    const formRect = form?.getBoundingClientRect();
    const imageRect = image?.getBoundingClientRect();
    
    return {
      formOverlaysImage: formRect && imageRect ? (
        formRect.top < imageRect.bottom &&
        formRect.bottom > imageRect.top &&
        formRect.right > imageRect.left &&
        formRect.left < imageRect.right
      ) : false,
      formAtBottomRight: formRect && imageRect ? (
        formRect.bottom <= imageRect.bottom + 100 &&
        formRect.right <= imageRect.right + 10
      ) : false
    };
  });
  
  console.log('Layout Check:');
  console.log('- Form overlays image:', final.formOverlaysImage);
  console.log('- Form at bottom-right:', final.formAtBottomRight);
  console.log('\nScreenshot saved to contact-final.png');
  
  await browser.close();
})();
