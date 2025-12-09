const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  
  await page.goto('http://localhost:8000/contact/', { waitUntil: 'networkidle0' });
  
  const measurements = await page.evaluate(() => {
    const heroContent = document.querySelector('.contact-hero-content');
    const heroText = document.querySelector('.contact-hero-text');
    const heroImage = document.querySelector('.contact-hero-image');
    const img = heroImage?.querySelector('img');
    
    return {
      heroContentWidth: heroContent?.getBoundingClientRect().width,
      heroTextWidth: heroText?.getBoundingClientRect().width,
      heroTextHeight: heroText?.getBoundingClientRect().height,
      imageWidth: img?.getBoundingClientRect().width,
      imageHeight: img?.getBoundingClientRect().height,
      imageBottom: img?.getBoundingClientRect().bottom,
    };
  });
  
  console.log(JSON.stringify(measurements, null, 2));
  
  await browser.close();
})();
