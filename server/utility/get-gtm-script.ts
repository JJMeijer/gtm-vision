import bent from 'bent';
import { parse } from 'querystring';

import { createClientFeedback } from './create-client-feedback';
import { cache } from './cache';
import { serverLogger } from './loggers';
import { parseGtm } from '../parsers/gtm';

import { ParsedContainer } from '../types';

export interface GetGtmResponse {
  parsedContainer?: ParsedContainer;
  gtmId?: string;
  message?: string;
  code?: number;
}

/**
 * a Request is done for to find the GTM script for the given ID
 * The response body is parsed to find the relevant container
 * this container is then parsed by the GTM Parser and returned.
 * If errors occur they are returned to the user.
 */
export const getGtmScript = async function getGtmScript(gtmUrl: string): Promise<GetGtmResponse> {
  const gtmUrlObj = new URL(gtmUrl);
  const query = parse(gtmUrlObj.search.substr(1));
  const { id: gtmId } = query;

  if (typeof gtmId === 'string') {
    const cachedContainer = cache.get(gtmId) as ParsedContainer;
    if (cachedContainer) {
      serverLogger.info('Cached Container Used', { gtmId });
      return { parsedContainer: cachedContainer, gtmId };
    }

    let body: string;

    try {
      const getString = bent('string');
      body = await getString(gtmUrl);
    } catch (e) {
      return createClientFeedback('GTM_NOT_FOUND', { gtmUrl });
    }

    try {
      const containerMatch = body.match(/{\n"resource":\s{[\s\S]*;\n\/\*\n\n/g);

      if (containerMatch !== null) {
        const containerText = containerMatch[0].replace(';\n/*\n\n', '');
        const container = JSON.parse(containerText);

        const parsedContainer = parseGtm(container);

        cache.set(gtmId, parsedContainer);

        return { parsedContainer, gtmId };
      }
    } catch (e) {
      return createClientFeedback('GTM_PARSING_ERROR', { gtmUrl });
    }
  }

  return createClientFeedback('UNEXPECTED_GTM_URL', { gtmUrl });
};
