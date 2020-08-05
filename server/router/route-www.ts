import { Request, Response, NextFunction } from 'express';

import { validateRequestQuery } from '../utility/validate-request';
import { websiteDatabase } from '../utility/database';
import { serverLogger } from '../utility/loggers';
import { getGtmScript } from '../utility/get-gtm-script';
import { createClientFeedback } from '../utility/create-client-feedback';
import { scrapeWebsite } from '../utility/scrape-website';

/**
 * POST method to get the GTM container for a given URL
 * The URL is expected in the 'value' property of the
 * request body. There are 3 possible flows
 * - Get GTM url from the database & use the cached response for that GTM url
 * - Get GTM url from the database & get the script from googletagmanager servers
 * - Scrape URL to find GTM url and get the script from googletagmanager servers
 */
export const routeWww = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    validateRequestQuery(req, ['value']);

    const { value } = req.query;
    const valueString = value as string;

    // Parse Url
    const valueUrl = new URL(!valueString.match('^http') ? `http://${valueString}` : valueString);

    // Database reference
    const { hostname } = valueUrl;
    const databaseReference = websiteDatabase.doc(hostname);

    // Get Database Data
    const databaseData = await databaseReference
      .get()
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
      const { gtmUrl } = databaseData as { gtmUrl: string };
      if (gtmUrl === 'unknown') {
        serverLogger.info('unknown value found in Firestore Database', { hostname });

        const { message, code } = createClientFeedback('SCRIPT_NOT_FOUND_SECONDARY', { hostname });
        res.json({ message, code });
      } else {
        serverLogger.info('GTM URL used from Firestore Database', { hostname, gtmUrl });

        // Get Container for GTM URL
        const { parsedContainer, gtmId, message, code } = await getGtmScript(gtmUrl);

        if (!parsedContainer && !message) {
          throw new Error('Unexpected Error');
        }

        if (parsedContainer) {
          res.json({ parsedContainer, gtmId });
        }

        if (message) {
          // Return Error to client.
          res.json({ message, code });
        }
      }
    } else {
      const { gtmUrl, message: scrapeMessage, code: scrapeCode } = await scrapeWebsite(
        valueUrl.href,
      );

      if (gtmUrl) {
        // Get Container for GTM URL
        const { parsedContainer, gtmId, message, code } = await getGtmScript(gtmUrl);

        if (!parsedContainer && !message) {
          throw new Error('Unexpected Error');
        }

        if (parsedContainer) {
          // Set GTM URL in database so we don't have to scrape next time
          const reference = websiteDatabase.doc(hostname);
          reference.set({ gtmUrl });
          serverLogger.info('GTM URL stored in websites database', { gtmUrl, hostname });

          // Parse container & return
          res.json({ parsedContainer, gtmId });
        }

        if (message) {
          // Return Error to client.
          res.json({ message, code });
        }
      } else if (scrapeMessage) {
        // Error Occured during scraping
        res.json({
          clientFeedbackMessage: scrapeMessage,
          clientFeedbackCode: scrapeCode,
        });
      } else {
        // Scraper returned nothing
        const { message, code } = createClientFeedback('SCRIPT_NOT_FOUND_FIRST', {
          url: valueUrl.href,
        });

        // Store in database that the scraper returned nothing
        const reference = websiteDatabase.doc(hostname);
        reference.set({ gtmUrl: 'unknown' });
        serverLogger.info('unknown value stored in websites database', { hostname });

        // Return Error to client.
        res.json({ message, code });
      }
    }
  } catch (e) {
    next(e);
  }
};
