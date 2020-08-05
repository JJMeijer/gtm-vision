import { Request, Response, NextFunction } from 'express';

import { validateRequestQuery } from '../utility/validate-request';
import { getGtmScript } from '../utility/get-gtm-script';
import { serverLogger } from '../utility/loggers';
/**
 * POST method to get the GTM container for a gtm ID
 * GTM ID is expected in the 'value' property of the
 * request body.
 */
export const routeGtm = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    validateRequestQuery(req, ['value']);

    const { value } = req.query;
    const gtmUrl = `https://www.googletagmanager.com/gtm.js?id=${value}`;

    // Get container at URL
    const { parsedContainer, gtmId, message, code } = await getGtmScript(gtmUrl);

    if (!parsedContainer && !message) {
      throw new Error('Unexpected Error');
    }

    if (parsedContainer) {
      res.json({ parsedContainer, gtmId });
    }

    if (message) {
      serverLogger.info(`Client Error Message: ${message}`, { gtmUrl, code });

      // Return Error to client.
      res.json({ message, code });
    }
  } catch (e) {
    next(e);
  }
};
