import { Request, Response, NextFunction } from 'express';

import { validateRequestQuery } from '../utility/validate-request';
import { getGtmScript } from '../utility/get-gtm-script';
import { createClientFeedback } from '../utility/create-client-feedback';
import { scrapeWebsite } from '../utility/scrape-website';

/**
 * POST method to get the GTM container for a given URL
 * The URL is expected in the 'value' property of the
 * request body.
 */
export const routeWww = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    validateRequestQuery(req, ['value']);

    const { value } = req.query;
    const valueString = value as string;

    // Parse Url
    const valueUrl = new URL(!valueString.match('^http') ? `http://${valueString}` : valueString);

    const { gtmUrl, message: scrapeMessage, code: scrapeCode } = await scrapeWebsite(
      valueUrl.href,
    );

    if (gtmUrl) {
      // Get Container for GTM URL
      const { resolvedContainer, gtmId, message, code } = await getGtmScript(gtmUrl);

      if (!resolvedContainer && !message) {
        throw new Error('Unexpected Error');
      }

      if (resolvedContainer) {

        // Parse container & return
        res.json({ resolvedContainer, gtmId });
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

      // Return Error to client.
      res.json({ message, code });
    }
  } catch (e) {
    next(e);
  }
};
