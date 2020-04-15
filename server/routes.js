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

/**
 * POST method to get the GTM container for a gtm ID
 * GTM ID is expected in the 'value' property of the
 * request body.
 */
router.post('/api/gtm', (req, res, next) => {
  try {
    if (req.body && req.body.value) {
      const { value } = req.body;

      /**
       * Check if the value exists in cache and return the data
       * for that value if true.
       */
      const cachedContainer = containerCache.get(value);
      if (cachedContainer) {
        logger.info(`cachedContainer Used for ${value}`);
        res.json(cachedContainer);
      } else {
        /**
         * If not in cache a request is done for to find the GTM script for
         * the given value. If the response code is OK, the response body is parsed
         * to find the relevant container information. This info is parsed as JSON
         * and returned to client (and stored in cache)
         */
        request(`https://www.googletagmanager.com/gtm.js?id=${value}`, (err, response, body) => {
          if (!err) {
            if (response.statusCode === 200) {
              if (body.match(/{\n"resource":\s{[\s\S]*,\n"runtime"/g)) {
                const containerText = body.match(/{\n"resource":\s{[\s\S]*,\n"runtime"/g)[0].replace(/,\n"runtime"/, '}');
                const container = JSON.parse(unescape(containerText));
                containerCache.set(value, container);
                res.json(container);
              } else {
                next(new Error('Could not parse GTM script for this ID'));
              }
            } else {
              next(new Error('Could not find GTM script for this ID'));
            }
          } else {
            next(err);
          }
        });
      }
    } else {
      const err = new Error('No Request Body found');
      err.status = 400;
      throw err;
    }
  } catch (e) {
    next(e);
  }
});

/**
 * POST method to get the GTM container for a given URL
 * The URL is expected in the 'value' property of the
 * request body.
 */
router.post('/api/www', async (req, res, next) => {
  try {
    if (req.body && req.body.value) {
      const { value } = req.body;

      const valueUrl = new URL(!value.match('^http') ? `http://${value}` : value);

      /**
       * Check if the value exists in cache and return the data
       * for that value if true.
       */
      const cachedContainer = containerCache.get(valueUrl.href);
      if (cachedContainer) {
        logger.info(`cachedContainer Used for ${valueUrl}`);
        res.json(cachedContainer);
      } else {
        /**
         * If not in cache a puppeteer browser is created where the given
         * URL is visited. When the page is loaded a search is done for
         * GTM scripts on that page. A request is done for the first GTM script
         * that is found. If the response code of that request is OK, the
         * response body is parsed to find the relevant container information.
         * This info is parsed as JSON and returned to client (and stored in cache)
         */
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(valueUrl, { waitUntil: 'networkidle2' });

        const gtmUrl = await page.evaluate(() => {
          const scripts = Array.prototype.slice.call(document.querySelectorAll('script[src*="googletagmanager.com/gtm.js?id=GTM-"]'));
          return scripts.map(x => x.src)[0];
        });

        if (gtmUrl) {
          request(gtmUrl, (err, response, body) => {
            if (!err) {
              if (response.statusCode === 200) {
                if (body.match(/{\n"resource":\s{[\s\S]*,\n"runtime"/g)) {
                  const containerText = body.match(/{\n"resource":\s{[\s\S]*,\n"runtime"/g)[0].replace(/,\n"runtime"/, '}');
                  const container = JSON.parse(unescape(containerText));
                  containerCache.set(valueUrl, container);
                  res.json(container);
                } else {
                  next(new Error('Could not parse GTM script for this ID'));
                }
              } else {
                next(new Error('Could not find GTM script for this ID'));
              }
            } else {
              next(err);
            }
          });
        } else {
          next(new Error('No GTM container found at URL'));
        }
        await browser.close();
      }
    } else {
      const err = new Error('No Request Body found');
      err.status = 400;
      next(err);
    }
  } catch (e) {
    next(e);
  }
});

export default router;
