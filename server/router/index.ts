import express from 'express';
import { routeGtm } from './route-gtm';

export const apiRouter = express.Router();

apiRouter.get('/api/gtm', routeGtm);
