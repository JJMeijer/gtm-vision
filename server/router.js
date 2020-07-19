import express from 'express';

import { routeApiGtm, routeApiWww, routeApiError } from './routes';

const apiRouter = express.Router();

apiRouter.get('/api/gtm', routeApiGtm);

apiRouter.get('/api/www', routeApiWww);

apiRouter.post('/api/error', routeApiError);

export default apiRouter;
