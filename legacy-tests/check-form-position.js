const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  
  await page.goto('http://localhost:8000/contact/', { waitUntil: 'networkidle0' });
  
  const positions = await page.evaluate(() => {
    const heroText = document.querySelector('.contact-hero-text');
    const form = document.querySelector('.contact-form-container');
    const image = document.querySelector('.contact-hero-image img');
    
    const heroTextRect = heroText?.getBoundingClientRect();
    const formRect = form?.getBoundingClientRect();
    const imageRect = image?.getBoundingClientRect();
    
    return {
      heroText: { top: heroTextRect?.top, bottom: heroTextRect?.bottom, height: heroTextRect?.height },
      form: { top: formRect?.top, bottom: formRect?.bottom, height: formRect?.height },
      image: { top: imageRect?.top, bottom: imageRect?.bottom, height: imageRect?.height },
      desiredFormBottom: imageRect?.bottom,
      currentFormBottom: formRect?.bottom,
      needToMoveDown: imageRect && formRect ? imageRect.bottom - formRect.bottom : 0
    };
  });
  
  console.log(JSON.stringify(positions, null, 2));
  
  await browser.close();
})();
