import { Request, Response, NextFunction } from 'express';

import { validateRequestBody } from '../utility/validate-request';
import { FrontendError } from '../utility/errors';
import { frontendLogger } from '../utility/loggers';

/**
 * POST method to send an error to the server for
 * logging purposes. The body is expected to contain
 * a message, name & stack property.
 */
export const routeError = (req: Request, res: Response, next: NextFunction): void => {
  try {
    validateRequestBody(req, ['message', 'name', 'stack', 'gtmId']);

    const { message, name, stack, gtmId } = req.body;
    const error = new FrontendError(gtmId, message);

    error.name = name;
    error.stack = stack;

    frontendLogger.error(`${name}: `, error);
    res.send('OK');
  } catch (e) {
    next(e);
  }
};
