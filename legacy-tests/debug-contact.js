const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  
  await page.goto('http://localhost:8000/contact/', { waitUntil: 'networkidle0' });
  
  // Get HTML structure
  const structure = await page.evaluate(() => {
    const heroContent = document.querySelector('.contact-hero-content');
    return {
      innerHTML: heroContent ? heroContent.innerHTML.substring(0, 500) : null,
      children: heroContent ? Array.from(heroContent.children).map(el => ({
        tagName: el.tagName,
        className: el.className
      })) : null
    };
  });
  
  console.log('HTML Structure:');
  console.log(JSON.stringify(structure, null, 2));
  
  await browser.close();
})();
