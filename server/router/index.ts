import express from 'express';
import { routeGtm } from './route-gtm';
import { routeWww } from './route-www';
import { routeError } from './route-error';

export const apiRouter = express.Router();

apiRouter.get('/api/gtm', routeGtm);

apiRouter.get('/api/www', routeWww);

apiRouter.post('/api/error', routeError);
