const puppeteer = require('puppeteer');

async function comparePages() {
  const browser = await puppeteer.launch({ headless: false });

  // Test at different widths
  const testWidths = [480, 600, 750, 900, 1024, 1400];

  for (const width of testWidths) {
    console.log(`\n========================================`);
    console.log(`Testing at ${width}x800...`);
    console.log(`========================================`);

    // Test Home Page
    const homePage = await browser.newPage();
    await homePage.setViewport({ width, height: 800 });
    await homePage.setCacheEnabled(false);
    await homePage.goto(`http://localhost:8000?t=${Date.now()}`, { waitUntil: 'networkidle0' });

    const homePageData = await homePage.evaluate(() => {
      const getData = (selector) => {
        const el = document.querySelector(selector);
        if (!el) return null;
        const computed = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return {
          fontSize: computed.fontSize,
          fontWeight: computed.fontWeight,
          marginTop: computed.marginTop,
          marginBottom: computed.marginBottom,
          paddingTop: computed.paddingTop,
          paddingBottom: computed.paddingBottom,
          width: rect.width,
          height: rect.height
        };
      };

      return {
        ourStoryHeading: getData('.our-story-heading'),
        ourTeamHeading: getData('.team-heading'),
        ourFacilityHeading: getData('.our-facility-heading'),
        ourStorySection: getData('.our-story'),
        ourTeamSection: getData('.our-team'),
        ourFacilitySection: getData('.our-facility')
      };
    });

    console.log('\nHOME PAGE:');
    console.log('Our Story Heading:', JSON.stringify(homePageData.ourStoryHeading, null, 2));
    console.log('Our Team Heading:', JSON.stringify(homePageData.ourTeamHeading, null, 2));
    console.log('Our Facility Heading:', JSON.stringify(homePageData.ourFacilityHeading, null, 2));
    console.log('Our Story Section:', JSON.stringify(homePageData.ourStorySection, null, 2));

    await homePage.screenshot({
      path: `/Users/Nick/Desktop/Generation Web/FiveNine Optics/fivenine-site/home-${width}.png`,
      fullPage: true
    });

    await homePage.close();

    // Test Products Page
    const productsPage = await browser.newPage();
    await productsPage.setViewport({ width, height: 800 });
    await productsPage.setCacheEnabled(false);
    await productsPage.goto(`http://localhost:8000/products/?t=${Date.now()}`, { waitUntil: 'networkidle0' });

    const productsPageData = await productsPage.evaluate(() => {
      const getData = (selector) => {
        const el = document.querySelector(selector);
        if (!el) return null;
        const computed = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return {
          fontSize: computed.fontSize,
          fontWeight: computed.fontWeight,
          marginTop: computed.marginTop,
          marginBottom: computed.marginBottom,
          paddingTop: computed.paddingTop,
          paddingBottom: computed.paddingBottom,
          width: rect.width,
          height: rect.height
        };
      };

      return {
        productsHeading: getData('.products-heading'),
        productsColumnHeading: getData('.products-column-heading'),
        productsHero: getData('.products-hero'),
        productsHeroImage: getData('.products-hero-image img'),
        productsDetails: getData('.products-details')
      };
    });

    console.log('\nPRODUCTS PAGE:');
    console.log('Products Heading:', JSON.stringify(productsPageData.productsHeading, null, 2));
    console.log('Products Column Heading:', JSON.stringify(productsPageData.productsColumnHeading, null, 2));
    console.log('Products Hero:', JSON.stringify(productsPageData.productsHero, null, 2));
    console.log('Products Hero Image:', JSON.stringify(productsPageData.productsHeroImage, null, 2));
    console.log('Products Details:', JSON.stringify(productsPageData.productsDetails, null, 2));

    await productsPage.screenshot({
      path: `/Users/Nick/Desktop/Generation Web/FiveNine Optics/fivenine-site/products-${width}.png`,
      fullPage: true
    });

    await productsPage.close();

    // Compare
    console.log('\n--- COMPARISON ---');
    if (homePageData.ourStoryHeading && productsPageData.productsHeading) {
      console.log('Section Heading Font Size - Home:', homePageData.ourStoryHeading.fontSize, 'vs Products:', productsPageData.productsHeading.fontSize);
      console.log('Match:', homePageData.ourStoryHeading.fontSize === productsPageData.productsHeading.fontSize ? '✓' : '✗');
    }
  }

  await browser.close();
}

comparePages().catch(console.error);
