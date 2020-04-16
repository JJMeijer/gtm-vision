import express from 'express';

import { frontendLogger } from './loggers';

const errorRouter = express.Router();

errorRouter.post('/error', (req, res, next) => {
  try {
    if (!req.body.message) {
      const e = new Error('No request body found');
      e.status = 400;
      throw e;
    }

    const { message, name, stack } = req.body;
    const error = new Error(message);

    error.name = name;
    error.stack = stack;

    frontendLogger.error(`${name}: `, error);
    res.send('OK');
  } catch (e) {
    next(e);
  }
});

export default errorRouter;
