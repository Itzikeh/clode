
import express from 'express';
import puppeteer from 'puppeteer-core';

const app = express();
const port = process.env.PORT || 8080;

const browserWSEndpoint = 'wss://brd-customer-hl_ff473d9e-zone-scraping_browser1:1107w17z38ha@brd.superproxy.io:9222';

app.get('/search', async (req, res) => {
  const query = req.query.q || 'חנוך לופו site:linkedin.com';
  try {
    const browser = await puppeteer.connect({
      browserWSEndpoint,
      defaultViewport: null,
    });

    const page = await browser.newPage();
    await page.goto(`https://www.google.com/search?q=${encodeURIComponent(query)}`);

    const links = await page.$$eval('a', as =>
      as.map(a => a.href).filter(href => href.includes('linkedin.com/in'))
    );

    await browser.close();

    if (links.length > 0) {
      res.send(links[0]);
    } else {
      res.send('לא נמצאה תוצאה.');
    }
  } catch (err) {
    console.error('❌ שגיאה:', err.message);
    res.status(500).send('שגיאה: ' + err.message);
  }
});

app.get('/', (req, res) => {
  res.send('Bright Data server is running ✅');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
