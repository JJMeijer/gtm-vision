import bent from 'bent';
import { parse } from 'querystring';

import { createClientFeedback, containerCache, serverLogger } from '.';

/**
 * a Request is done for to find the GTM script for the given ID
 * The response body is parsed to find the relevant container
 * information inside the script. This info is parsed as JSON and returned.
 */
const getGtmScript = async function getGtmScript(gtmUrl) {
  const gtmUrlObj = new URL(gtmUrl);
  const query = parse(gtmUrlObj.search.substr(1));
  const { id: gtmId } = query;

  // Return cached value if it exists.
  const cachedContainer = containerCache.get(gtmId);
  if (cachedContainer) {
    serverLogger.info('Cached Container Used', { gtmId });
    containerCache.ttl(gtmId, 600);
    return { container: cachedContainer, gtmId };
  }

  let body;

  try {
    const getString = bent('string');
    body = await getString(gtmUrl);
  } catch (e) {
    return createClientFeedback('GTM_NOT_FOUND', { gtmUrl });
  }

  if (body && body.match(/{\n"resource":\s{[\s\S]*,\n"runtime"/g)) {
    const containerText = body.match(/{\n"resource":\s{[\s\S]*,\n"runtime"/g)[0].replace(/,\n"runtime"/, '}');
    const container = JSON.parse(containerText);
    containerCache.set(gtmId, container);
    return { container, gtmId };
  }

  return createClientFeedback('GTM_PARSING_ERROR', { gtmUrl });
};

export default getGtmScript;
