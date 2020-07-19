import {
  validateRequestBody,
  serverLogger,
  getGtmScript,
  websiteDatabase,
  scrapeWebsite,
  createClientFeedback,
} from '../utility';

import parseGtm from '../parsers/gtm-parser';

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
      if (gtmUrl === 'unknown') {
        serverLogger.info('unknown value found in Firestore Database', { hostname });

        const { clientFeedbackMessage, clientFeedbackCode } = createClientFeedback('SCRIPT_NOT_FOUND_SECONDARY', { hostname });
        res.json({ clientFeedbackMessage, clientFeedbackCode });
      } else {
        serverLogger.info('GTM URL used from Firestore Database', { hostname, gtmUrl });

        // Get Container for GTM URL
        const {
          container,
          gtmId,
          clientFeedbackMessage,
          clientFeedbackCode,
        } = await getGtmScript(gtmUrl);

        if (!container && !clientFeedbackMessage) {
          throw new Error('Unexpected Error');
        }

        if (container) {
          // Parse container & return
          const { resource } = container;
          const parsedContainer = parseGtm(resource);
          res.json({ parsedContainer, gtmId });
        }

        if (clientFeedbackMessage) {
          // Return Error to client.
          res.json({ clientFeedbackMessage, clientFeedbackCode });
        }
      }
    } else {
      const {
        gtmUrl,
        clientFeedbackMessage: scrapingErrorMessage,
        clientFeedbackCode: scrapingErrorCode,
      } = await scrapeWebsite(valueUrl.href);

      if (gtmUrl) {
        // Get container at  the URL
        const {
          container,
          gtmId,
          clientFeedbackMessage,
          clientFeedbackCode,
        } = await getGtmScript(gtmUrl);

        if (!container && !clientFeedbackMessage) {
          throw new Error('Unexpected Error');
        }

        if (container) {
          // Set GTM URL in database so we don't have to scrape next time
          const reference = websiteDatabase.doc(hostname);
          reference.set({ gtmUrl });
          serverLogger.info('GTM URL stored in websites database', { gtmUrl, hostname });

          // Parse container & return
          const { resource } = container;
          const parsedContainer = parseGtm(resource);
          res.json({ parsedContainer, gtmId });
        }

        if (clientFeedbackMessage) {
          // Return Error to client.
          res.json({ clientFeedbackMessage, clientFeedbackCode });
        }
      } else if (scrapingErrorMessage) {
        // Error Occured during scraping
        res.json({
          clientFeedbackMessage: scrapingErrorMessage,
          clientFeedbackCode: scrapingErrorCode,
        });
      } else {
        // Scraper returned nothing
        const { clientFeedbackMessage, clientFeedbackCode } = createClientFeedback('SCRIPT_NOT_FOUND_FIRST', { url: valueUrl.href });

        // Store in database that the scraper returned nothing
        const reference = websiteDatabase.doc(hostname);
        reference.set({ gtmUrl: 'unknown' });
        serverLogger.info('unknown value stored in websites database', { hostname });

        // Return Error to client.
        res.json({ clientFeedbackMessage, clientFeedbackCode });
      }
    }
  } catch (e) {
    next(e);
  }
}
