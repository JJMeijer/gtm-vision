import bent from 'bent';

/**
 * a Request is done for to find the GTM script for the given ID
 * The response body is parsed to find the relevant container
 * information inside the script. This info is parsed as JSON and returned.
 */
const getGtmScript = async (gtmUrl) => {
  let body;

  try {
    const getString = bent('string');
    body = await getString(gtmUrl);
  } catch (e) {
    const errorMessage = 'Could not find GTM container';
    return { errorMessage };
  }

  if (body.match(/{\n"resource":\s{[\s\S]*,\n"runtime"/g)) {
    const containerText = body.match(/{\n"resource":\s{[\s\S]*,\n"runtime"/g)[0].replace(/,\n"runtime"/, '}');
    const container = JSON.parse(unescape(containerText));
    return { container };
  }

  const errorMessage = 'Could not find expected content in GTM script';
  return { errorMessage };
};

export default getGtmScript;
