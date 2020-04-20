import { validateRequestBody, frontendLogger } from '../utility';

/**
 * POST method to send an error to the server for
 * logging purposes. The body is expected to contain
 * a message, name & stack property.

 */
export default function routeApiError(req, res, next) {
  try {
    validateRequestBody(req, ['message', 'name', 'stack']);

    const { message, name, stack } = req.body;
    const error = new Error(message);

    error.name = name;
    error.stack = stack;

    frontendLogger.error(`${name}: `, error);
    res.send('OK');
  } catch (e) {
    next(e);
  }
}