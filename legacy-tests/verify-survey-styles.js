const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Load the local resources page
  const filePath = 'file://' + path.join(__dirname, '_site/resources/index.html');
  await page.goto(filePath);

  // Check if the survey-intro element exists and get its styles
  const surveyIntroStyles = await page.evaluate(() => {
    const element = document.querySelector('.survey-intro');
    if (!element) {
      return { exists: false };
    }

    const styles = window.getComputedStyle(element);
    return {
      exists: true,
      color: styles.color,
      marginBottom: styles.marginBottom,
      text: element.textContent.trim()
    };
  });

  console.log('Survey Intro Element:');
  console.log(JSON.stringify(surveyIntroStyles, null, 2));

  // Check the survey link styles
  const surveyLinkStyles = await page.evaluate(() => {
    const element = document.querySelector('.survey-link');
    if (!element) {
      return { exists: false };
    }

    const styles = window.getComputedStyle(element);
    return {
      exists: true,
      color: styles.color,
      text: element.textContent.trim()
    };
  });

  console.log('\nSurvey Link Element:');
  console.log(JSON.stringify(surveyLinkStyles, null, 2));

  // Take a screenshot of the news section
  const newsSection = await page.$('.news-article');
  if (newsSection) {
    await newsSection.screenshot({ path: 'news-section-screenshot.png' });
    console.log('\nScreenshot saved as news-section-screenshot.png');
  }

  await browser.close();
})();
