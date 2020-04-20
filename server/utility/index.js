// Validate Request Function
const validateRequestBody = (req, values) => {
  values.forEach((key) => {
    if (!(req.body[key] && typeof req.body[key] === 'string')) {
      const err = new Error('Invalid request body');
      err.status = 400;
      throw err;
    }
  });
};

export { serverLogger, frontendLogger } from './loggers';
export { default as getGtmScript } from './get-gtm-script';
export { default as containerCache } from './container-cache';
export { validateRequestBody };
