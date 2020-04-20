import puppeteer from 'puppeteer';

import {
  validateRequestBody,
  containerCache,
  serverLogger,
  getGtmScript,
} from '../utility';

/**
 * POST method to get the GTM container for a given URL
 * The URL is expected in the 'value' property of the
 * request body.
 */
export default async function routeApiWww(req, res, next) {
  try {
    validateRequestBody(req, ['value']);

    const { value } = req.body;
    const valueUrl = new URL(!value.match('^http') ? `http://${value}` : value);

    // Return cached value if it exists.
    const cachedContainer = containerCache.get(valueUrl.href);
    if (cachedContainer) {
      serverLogger.info(`cachedContainer Used for ${valueUrl}`);
      containerCache.ttl(valueUrl.href, 600);
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
          const { container, errorMessage } = await getGtmScript(gtmUrl);

          if (!container && !errorMessage) {
            throw new Error('Unexpected Error');
          }

          if (container) {
            // Set value in Cache
            containerCache.set(valueUrl.href, container);

            // Return to client.
            res.json(container);
          }

          if (errorMessage) {
            serverLogger.info(`Client Error Message: ${errorMessage}`);

            // Return Error to client.
            res.json({ errorMessage });
          }
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
}
