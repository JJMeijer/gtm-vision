import express from 'express';

import logger from './logger';

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
    error.category = 'frontend';

    logger.error(error);
    res.status(200).send();
  } catch (e) {
    next(e);
  }
});

export default errorRouter;
