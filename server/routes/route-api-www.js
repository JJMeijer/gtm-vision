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
    const { hostname } = valueUrl;
    const databaseReference = websiteDatabase.doc(hostname);

    // Get Database Data
    const databaseData = await databaseReference.get()
      .then((doc) => {
        if (!doc.exists) {
          return false;
        }
        return doc.data();
      })
      .catch((err) => {
        serverLogger.error(err);
        return false;
      });

    if (databaseData) {
      const { gtmUrl } = databaseData;
      serverLogger.info('GTM URL used from Firestore Database', { hostname, gtmUrl });

      // Get Container for GTM URL
      const { container, errorMessage, gtmId } = await getGtmScript(gtmUrl);

      if (!container && !errorMessage) {
        throw new Error('Unexpected Error');
      }

      if (container) {
        // Return to client.
        res.json({ container, gtmId });
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
        const { container, errorMessage, gtmId } = await getGtmScript(gtmUrl);

        if (!container && !errorMessage) {
          throw new Error('Unexpected Error');
        }

        if (container) {
          // Set GTM URL in database so we don't have to scrape next time
          const reference = websiteDatabase.doc(hostname);

          reference.set({ gtmUrl });
          serverLogger.info('GTM URL stored in websites database', { gtmUrl, hostname });

          // Return to client.
          res.json({ container, gtmId });
        }

        if (errorMessage) {
          serverLogger.info(`Client Error Message: ${errorMessage}`);

          // Return Error to client.
          res.json({ errorMessage });
        }
      } else {
        // Scraper returned nothing
        const errorMessage = 'Could not find GTM container at provided URL';
        serverLogger.info(`Client Error Message: ${errorMessage}`, { url: valueUrl.href });

        // Return Error to client.
        res.json({ errorMessage });
      }
    }
  } catch (e) {
    next(e);
  }
}
