const puppeteer = require('puppeteer');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Simple static file server
const server = http.createServer((req, res) => {
  let requestPath = req.url === '/' ? 'index.html' : req.url;

  // Handle directory requests by appending index.html
  if (requestPath.endsWith('/')) {
    requestPath += 'index.html';
  }

  let filePath = path.join(__dirname, '_site', requestPath);

  // If path is a directory, try index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  const ext = path.extname(filePath);
  const contentType = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.webp': 'image/webp'
  }[ext] || 'text/plain';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      console.log('Error reading file:', filePath, err.message);
      res.writeHead(404);
      res.end('404 Not Found');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

(async () => {
  // Start server
  await new Promise(resolve => server.listen(3456, resolve));
  console.log('Server running on http://localhost:3456');

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    await page.goto('http://localhost:3456/resources/', { waitUntil: 'networkidle0' });
  } catch (e) {
    console.log('Error loading page:', e.message);
  }

  const styles = await page.evaluate(() => {
    const allPs = document.querySelectorAll('.news-text p');
    const surveyIntro = document.querySelector('p.survey-intro');
    const surveyLink = document.querySelector('a.survey-link');

    const getStyles = (el) => {
      if (!el) return null;
      const computed = window.getComputedStyle(el);
      return {
        color: computed.color,
        marginBottom: computed.marginBottom,
        textDecoration: computed.textDecoration,
        text: el.textContent.substring(0, 50)
      };
    };

    return {
      allParagraphs: Array.from(allPs).map(p => ({
        className: p.className,
        text: p.textContent.substring(0, 50)
      })),
      surveyIntro: getStyles(surveyIntro),
      surveyLink: getStyles(surveyLink)
    };
  });

  console.log('\nComputed Styles:');
  console.log(JSON.stringify(styles, null, 2));

  // Take screenshot
  const newsSection = await page.$('.news-article');
  if (newsSection) {
    await newsSection.screenshot({ path: 'news-section-final.png' });
    console.log('\nScreenshot saved as news-section-final.png');
  }

  await browser.close();
  server.close();

  process.exit(0);
})();
