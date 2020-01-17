import express from 'express';
import request from 'request';
import puppeteer from 'puppeteer';

const router = express.Router();

/* POST GTM ID */
router.post('/api/gtm', (req, res, next) => {
  try {
    if (req.body && req.body.value) {
      const { value } = req.body;

      request(`https://www.googletagmanager.com/gtm.js?id=${value}`, (err, response, body) => {
        if (!err) {
          if (body.match(/{\n"resource":\s{[\s\S]*,\n"runtime"/g)) {
            const containerText = body.match(/{\n"resource":\s{[\s\S]*,\n"runtime"/g)[0].replace(/,\n"runtime"/, '}');
            res.json(JSON.parse(unescape(containerText)));
          } else {
            throw new Error('No Valid container found for this ID');
          }
        } else {
          throw new Error(err);
        }
      });
    } else {
      throw new Error('No Request Body found');
    }
  } catch (e) {
    next(e);
  }
});

/* POST Website URL */
router.post('/api/www', async (req, res, next) => {
  try {
    if (req.body && req.body.value) {
      const { value } = req.body;

      const valueUrl = new URL(!value.match('^http') ? `http://${value}` : value);

      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      try {
        await page.goto(valueUrl, { waitUntil: 'domcontentloaded' });
      } catch (e) {
        console.log(e);
        throw new Error('Website not found');
      }

      const gtmUrl = await page.evaluate(() => {
        const scripts = Array.prototype.slice.call(document.querySelectorAll('script[src*="googletagmanager.com/gtm.js?id=GTM-"]'));
        return scripts.map(x => x.src)[0];
      });

      if (gtmUrl) {
        request(gtmUrl, (err, response, body) => {
          if (!err) {
            if (body.match(/{\n"resource":\s{[\s\S]*,\n"runtime"/g)) {
              const containerText = body.match(/{\n"resource":\s{[\s\S]*,\n"runtime"/g)[0].replace(/,\n"runtime"/, '}');
              res.json(JSON.parse(unescape(containerText)));
            } else {
              throw new Error('No Valid container found for this URL');
            }
          } else {
            throw new Error(err);
          }
        });
      } else {
        throw new Error('No GTM container found at URL');
      }
      await browser.close();
    } else {
      throw new Error('Missing POST request body');
    }
  } catch (e) {
    next(e);
  }
});

export default router;
