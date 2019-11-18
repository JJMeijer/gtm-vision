/**
 * Express Router
 */

import express from 'express';
import request from 'request';
import puppeteer from 'puppeteer';

const router = express.Router();

/* POST GTM ID */
router.post('/api/gtm', (req, res, next) => {
  if (req.body && req.body.value) {
    const { value } = req.body;

    request(`https://www.googletagmanager.com/gtm.js?id=${value}`, (err, response, body) => {
      if (!err) {
        if (body.match(/{\n"resource":\s{[\s\S]*,\n"runtime"/g)) {
          const containerText = body.match(/{\n"resource":\s{[\s\S]*,\n"runtime"/g)[0].replace(/,\n"runtime"/, '}');
          res.json(JSON.parse(unescape(containerText)));
        } else {
          const error = new Error('No Valid container found for this ID');
          error.status = 500;
          next(error);
        }
      } else {
        next(err);
      }
    });
  } else {
    const error = new Error('No Request Body found');
    error.status = 400;
    next(error);
  }
});

/* POST Website URL */
router.post('/api/www', (req, res, next) => {
  if (req.body && req.body.value) {
    const { value } = req.body;
    const valueUrl = new URL(value);
    (async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(valueUrl, { waitUntil: 'domcontentloaded' });

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
              const error = new Error('No Valid container found for this URL');
              error.status = 500;
              next(error);
            }
          } else {
            next(err);
          }
        });
      } else {
        const error = new Error('No GTM found at URL');
        error.status = 500;
        next(error);
      }
      await browser.close();
    })();
  } else {
    const error = new Error('Missing post request body');
    error.status = 400;
    next(error);
  }
});

export default router;
