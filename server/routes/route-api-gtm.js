import {
  validateRequestBody,
  serverLogger,
  getGtmScript,
} from '../utility';

/**
 * POST method to get the GTM container for a gtm ID
 * GTM ID is expected in the 'value' property of the
 * request body.
 */
export default async function routeApiGtm(req, res, next) {
  try {
    validateRequestBody(req, ['value']);

    const { value } = req.body;
    const gtmUrl = `https://www.googletagmanager.com/gtm.js?id=${value}`;

    // Get container at URL
    const { container, errorMessage } = await getGtmScript(gtmUrl);

    if (!container && !errorMessage) {
      throw new Error('Unexpected Error');
    }

    if (container) {
      // Return container to client.
      res.json({ container });
    }

    if (errorMessage) {
      serverLogger.info(errorMessage, {
        gtmUrl,
      });

      // Return Error to client.
      res.json({ errorMessage });
    }
  } catch (e) {
    next(e);
  }
}
