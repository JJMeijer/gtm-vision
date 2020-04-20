import {
  validateRequestBody,
  serverLogger,
  getGtmScript,
  websiteDatabase,
  scrapeWebsite,
} from '../utility';

/**
 * POST method to get the GTM container for a given URL
 * The URL is expected in the 'value' property of the
 * request body. There are 3 possible flows
 * - Get GTM url from the database & use the cached response for that GTM url
 * - Get GTM url from the database & get the script from googletagmanager servers
 * - Scrape URL to find GTM url and get the script from googletagmanager servers
 */
export default async function routeApiWww(req, res, next) {
  try {
    validateRequestBody(req, ['value']);

    const { value } = req.body;

    // Parse Url
    const valueUrl = new URL(!value.match('^http') ? `http://${value}` : value);

    // Database reference
    const databaseReference = websiteDatabase.doc(valueUrl.hostname);

    // Get Database Data
    const databaseData = await databaseReference.get()
      .then((doc) => {
        if (!doc.exists) {
          return false;
        }
        return doc.data();
      })
      .catch(err => serverLogger.error(err));

    if (databaseData) {
      const { gtmUrl } = databaseData;

      // Get Container for GTM URL
      const { container, errorMessage } = await getGtmScript(gtmUrl);

      if (!container && !errorMessage) {
        throw new Error('Unexpected Error');
      }

      if (container) {
        // Return to client.
        res.json({ container });
      }

      if (errorMessage) {
        serverLogger.info(`Client Error Message: ${errorMessage}`);

        // Return Error to client.
        res.json({ errorMessage });
      }
    } else {
      const gtmUrl = await scrapeWebsite(valueUrl.href, next);

      if (gtmUrl) {
        // Get container at  the URL
        const { container, errorMessage } = await getGtmScript(gtmUrl);

        if (!container && !errorMessage) {
          throw new Error('Unexpected Error');
        }

        if (container) {
          // Set GTM URL in database so we don't have to scrape next time
          const reference = websiteDatabase.doc(valueUrl.hostname);
          const setData = reference.set({
            gtmUrl,
          });
          serverLogger.info('GTM URL stored in websites database', setData);

          // Return to client.
          res.json(container);
        }

        if (errorMessage) {
          serverLogger.info(`Client Error Message: ${errorMessage}`);

          // Return Error to client.
          res.json({ errorMessage });
        }
      }
    }
  } catch (e) {
    next(e);
  }
}
