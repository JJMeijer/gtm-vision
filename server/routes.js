import express from 'express';
import request from 'request';
import puppeteer from 'puppeteer';
import NodeCache from 'node-cache';

import logger from './logger';

// Setup cache
const containerCache = new NodeCache({
  stdTTL: 300,
});

const router = express.Router();

/* POST GTM ID */
router.post('/api/gtm', (req, res, next) => {
  try {
    if (req.body && req.body.value) {
      const { value } = req.body;
      const cachedContainer = containerCache.get(value);
      if (cachedContainer) {
        logger.info(`cachedContainer Used for ${value}`);
        res.json(cachedContainer);
      } else {
        request(`https://www.googletagmanager.com/gtm.js?id=${value}`, (err, response, body) => {
          if (!err) {
            if (body.match(/{\n"resource":\s{[\s\S]*,\n"runtime"/g)) {
              const containerText = body.match(/{\n"resource":\s{[\s\S]*,\n"runtime"/g)[0].replace(/,\n"runtime"/, '}');
              const container = JSON.parse(unescape(containerText));
              containerCache.set(value, container);
              res.json(container);
            } else {
              throw new Error('No Valid container found for this ID');
            }
          } else {
            throw new Error(err);
          }
        });
      }
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
      const cachedContainer = containerCache.get(valueUrl.href);

      if (cachedContainer) {
        logger.info(`cachedContainer Used for ${valueUrl}`);
        res.json(cachedContainer);
      } else {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        try {
          await page.goto(valueUrl, { waitUntil: 'domcontentloaded' });
        } catch (e) {
          logger.info(e);
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
                const container = JSON.parse(unescape(containerText));
                containerCache.set(valueUrl.href, container);
                res.json(container);
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
      }
    } else {
      throw new Error('Missing POST request body');
    }
  } catch (e) {
    next(e);
  }
});

export default router;
