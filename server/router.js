import express from 'express';

import { routeApiGtm, routeApiWww, routeApiError } from './routes';

const router = express.Router();

router.post('/api/gtm', routeApiGtm);

router.post('/api/www', routeApiWww);

router.post('/api/error', routeApiError);

export default router;
