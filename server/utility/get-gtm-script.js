import bent from 'bent';
import { parse } from 'querystring';

import containerCache from './container-cache';
import { serverLogger } from './loggers';

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
    const errorMessage = 'Could not find Script for GTM container';
    return { errorMessage };
  }

  if (body && body.match(/{\n"resource":\s{[\s\S]*,\n"runtime"/g)) {
    const containerText = body.match(/{\n"resource":\s{[\s\S]*,\n"runtime"/g)[0].replace(/,\n"runtime"/, '}');
    const container = JSON.parse(containerText);
    containerCache.set(gtmId, container);
    return { container, gtmId };
  }

  const errorMessage = 'Could not find expected content in GTM script';
  return { errorMessage };
};

export default getGtmScript;
