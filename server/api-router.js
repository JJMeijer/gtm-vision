import express from 'express';
import puppeteer from 'puppeteer';
import NodeCache from 'node-cache';

import { serverLogger } from './loggers';
import getGtmScript from './get-gtm-script';

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
router.post('/api/gtm', async (req, res, next) => {
  try {
    if (!(req.body.value)) {
      const err = new Error('No request body found');
      err.status = 400;
      throw err;
    }

    const { value } = req.body;
    const cachedContainer = containerCache.get(value);

    // Return cached value if it exists.
    if (cachedContainer) {
      serverLogger.info(`cachedContainer Used for ${value}`);
      res.json(cachedContainer);
    } else {
      const gtmUrl = `https://www.googletagmanager.com/gtm.js?id=${value}`;

      // Get container at URL
      const container = await getGtmScript(gtmUrl);

      // Set value in Cache
      containerCache.set(value, container);

      // Return to client.
      res.json(container);
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
    if (!req.body.value) {
      const err = new Error('No request body found');
      err.status = 400;
      throw err;
    }

    const { value } = req.body;
    const valueUrl = new URL(!value.match('^http') ? `http://${value}` : value);

    // Return cached value if it exists.
    const cachedContainer = containerCache.get(valueUrl.href);
    if (cachedContainer) {
      serverLogger.info(`cachedContainer Used for ${valueUrl}`);
      res.json(cachedContainer);
    } else {
      /**
       * a Puppeteer browser is created where the given
       * URL is visited. When the page is loaded a search is done for
       * GTM scripts on that page. A request is done for the first GTM script
       * that is found.
       */
      const browser = await puppeteer.launch();
      // Init new try...catch block so we can close the browser instance on error
      try {
        const page = await browser.newPage();
        await page.goto(valueUrl, { waitUntil: 'networkidle2' });

        const gtmUrl = await page.evaluate(() => {
          const scripts = Array.prototype.slice.call(document.querySelectorAll('script[src*="googletagmanager.com/gtm.js?id=GTM-"]'));
          return scripts.map(x => x.src)[0];
        });

        if (gtmUrl) {
          // Get container at  the URL
          const container = await getGtmScript(gtmUrl);

          // Set value in Cache
          containerCache.set(value, container);

          // Return to client.
          res.json(container);
        }
      } catch (e) {
        await browser.close();
        next(e);
      }

      // Close the browser.
      await browser.close();
    }
  } catch (e) {
    next(e);
  }
});

export default router;
