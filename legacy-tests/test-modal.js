const puppeteer = require('puppeteer');

async function testModal() {
  const browser = await puppeteer.launch({ headless: false });

  // Test at different widths including desktop
  const testWidths = [480, 600, 750, 900, 1024, 1400];

  for (const width of testWidths) {
    const page = await browser.newPage();
    await page.setViewport({ width, height: 800 });

    console.log(`\nTesting at ${width}x800...`);

    // Navigate to the site with cache disabled
    await page.setCacheEnabled(false);
    await page.goto(`http://localhost:8000?t=${Date.now()}`, { waitUntil: 'networkidle0' });

    // Scroll to team section
    await page.evaluate(() => {
      const teamSection = document.querySelector('#our-team');
      if (teamSection) {
        teamSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    await new Promise(resolve => setTimeout(resolve, 1000));

    // Click the first team member
    await page.click('.team-member-photo');

    // Wait for modal to open
    await page.waitForSelector('.team-modal.active', { timeout: 5000 });
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Get modal dimensions and styles
    const modalInfo = await page.evaluate(() => {
      const modal = document.querySelector('.team-modal-content');
      const inner = document.querySelector('.team-modal-inner');
      const image = document.querySelector('.team-modal-image');
      const info = document.querySelector('.team-modal-info');

      const getStyles = (el) => {
        const computed = window.getComputedStyle(el);
        return {
          width: computed.width,
          height: computed.height,
          maxHeight: computed.maxHeight,
          flexDirection: computed.flexDirection,
          display: computed.display
        };
      };

      return {
        viewport: { width: window.innerWidth, height: window.innerHeight },
        modal: { ...getStyles(modal), rect: modal.getBoundingClientRect() },
        inner: getStyles(inner),
        image: { ...getStyles(image), rect: image.getBoundingClientRect() },
        info: { ...getStyles(info), rect: info.getBoundingClientRect() }
      };
    });

    console.log('Modal Info:', JSON.stringify(modalInfo, null, 2));

    // Take screenshot
    await page.screenshot({
      path: `/Users/Nick/Desktop/Generation Web/FiveNine Optics/fivenine-site/modal-test-${width}.png`,
      fullPage: false
    });

    console.log(`Screenshot saved: modal-test-${width}.png`);

    // Wait a bit before closing
    await new Promise(resolve => setTimeout(resolve, 2000));
    await page.close();
  }

  await browser.close();
}

testModal().catch(console.error);
