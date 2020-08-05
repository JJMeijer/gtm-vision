import express, { Request, Response, NextFunction } from 'express';
import compression from 'compression';
import morgan from 'morgan';
import helmet from 'helmet';
import { start as startDebug } from '@google-cloud/debug-agent';

import { apiRouter } from './router';
import { serverLogger } from './utility/loggers';
import { HttpError } from './utility/errors';

if (process.env.NODE_ENV === 'production') {
  startDebug({ allowExpressions: true });
}

// initialize Express app
const app = express();
const port = process.env.PORT || 3000;
const appFolder = 'public';

// Use Helmet to enhance API Security
app.use(helmet());

// use compression
app.use(compression());

// Bodyparser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use morgan logger during dev
if (process.env.NODE_ENV !== 'production') {
  const morganFormat = ':method :url HTTP/:http-version :status :response-time ms ":user-agent"';
  app.use(
    morgan(morganFormat, {
      stream: {
        write: (message) => serverLogger.info(message.trim()),
      },
    }),
  );
}

// serve static files
app.use(express.static(appFolder));

// SPA Routing
app.get('/', (_req, res) => {
  res.sendFile('index.html', { root: appFolder });
});

// Robots.txt Routing
app.get('/robots.txt', (_req, res) => {
  res.sendFile('robots.txt', { root: 'server' });
});

// Sitemap.xml routing
app.get('/sitemap.xml', (_req, res) => {
  res.sendFile('sitemap.xml', { root: 'server' });
});

// Api routing
app.use('/', apiRouter);

// 404 Handling
app.use((req, res) => {
  res.type('text/plain');
  res.status(404);
  res.send('In the future this will be a very beautiful 404 page.');

  const err = new HttpError(
    404,
    `Could not resolve request path: ${req.method} ${req.originalUrl}`,
  );
  serverLogger.error(`${err.name}: `, err);
});

// Main Error Handling
app.use((err: HttpError, _req: Request, res: Response, next: NextFunction) => {
  const { name, message, code = 500 } = err;
  serverLogger.error(`${name}: `, err);
  res.status(code);
  res.json({
    message,
  });

  next();
});

// Log uncaught Exceptions
process.on('uncaughtExceptionMonitor', (err) => serverLogger.error(err));

// Start Express app
serverLogger.info(`GTM Vision running on port: ${port}`);
app.listen(port);
