const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const filePath = 'file://' + path.join(__dirname, '_site/resources/index.html');
  await page.goto(filePath);

  // Get all matching CSS rules for the survey-intro element
  const debugInfo = await page.evaluate(() => {
    const surveyIntro = document.querySelector('.survey-intro');
    const surveyLink = document.querySelector('.survey-link');

    return {
      surveyIntro: {
        exists: !!surveyIntro,
        className: surveyIntro?.className,
        parentClassName: surveyIntro?.parentElement?.className,
        innerHTML: surveyIntro?.innerHTML
      },
      surveyLink: {
        exists: !!surveyLink,
        className: surveyLink?.className,
        parentElement: surveyLink?.parentElement?.tagName,
        parentClassName: surveyLink?.parentElement?.className,
        href: surveyLink?.href
      },
      stylesheets: Array.from(document.styleSheets).map(sheet => {
        try {
          return {
            href: sheet.href,
            rulesCount: sheet.cssRules?.length || 0
          };
        } catch(e) {
          return { error: e.message };
        }
      })
    };
  });

  console.log('Debug Info:');
  console.log(JSON.stringify(debugInfo, null, 2));

  await browser.close();
})();
