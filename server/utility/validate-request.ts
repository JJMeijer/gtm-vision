import { Request } from 'express';
import { HttpError } from './errors';

// Validate Request Body
export const validateRequestBody = (req: Request, values: string[]): void | HttpError => {
  if (req.body) {
    values.forEach((key) => {
      if (!(req.body[key] && typeof req.body[key] === 'string')) {
        const err = new HttpError(400, 'Invalid Request');
        throw err;
      }
    });
  }
};

// Validate Request Query parameters
export const validateRequestQuery = (req: Request, values: string[]): void | HttpError => {
  if (req.query) {
    values.forEach((key) => {
      if (!(req.query[key] && typeof req.query[key] === 'string')) {
        const err = new HttpError(400, 'Invalid Request');
        throw err;
      }
    });
  }
};
