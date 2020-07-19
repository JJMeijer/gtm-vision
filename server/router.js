import express from 'express';

import { routeApiGtm, routeApiWww, routeApiError } from './routes';

const apiRouter = express.Router();

apiRouter.post('/api/gtm', routeApiGtm);

apiRouter.post('/api/www', routeApiWww);

apiRouter.post('/api/error', routeApiError);

export default apiRouter;
