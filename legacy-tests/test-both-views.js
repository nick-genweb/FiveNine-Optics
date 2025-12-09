const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  
  // Desktop view
  const desktopPage = await browser.newPage();
  await desktopPage.setViewport({ width: 1440, height: 900 });
  await desktopPage.goto('http://localhost:8000/contact/', { waitUntil: 'networkidle0' });
  await desktopPage.screenshot({ path: 'contact-desktop.png', fullPage: true });
  console.log('Desktop screenshot saved to contact-desktop.png');
  
  // Mobile view
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 375, height: 667 });
  await mobilePage.goto('http://localhost:8000/contact/', { waitUntil: 'networkidle0' });
  await mobilePage.screenshot({ path: 'contact-mobile.png', fullPage: true });
  console.log('Mobile screenshot saved to contact-mobile.png');
  
  await browser.close();
  console.log('\nBoth views tested successfully!');
})();
