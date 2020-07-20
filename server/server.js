import express from 'express';
import compression from 'compression';
import morgan from 'morgan';
import helmet from 'helmet';
import { start as startDebug } from '@google-cloud/debug-agent';

import apiRouter from './router';
import { serverLogger } from './utility';

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
  app.use(morgan(morganFormat, {
    stream: {
      write: (message) => serverLogger.info(message.trim()),
    },
  }));
}

// serve static files
app.use(express.static(appFolder));

// SPA Routing
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: appFolder });
});

// Robots.txt Routing
app.get('/robots.txt', (req, res) => {
  res.sendFile('robots.txt', { root: 'server' });
});

// Sitemap.xml routing
app.get('/sitemap.xml', (req, res) => {
  res.sendFile('sitemap.xml', { root: 'server' });
});

// Api routing
app.use('/', apiRouter);

// 404 Handling
app.use((req, res) => {
  res.type('text/plain');
  res.send('In the future this will be a very beautiful 404 page.');

  const err = new Error(`Could not resolve request path: ${req.method} ${req.originalUrl}`);
  err.status = 404;
  serverLogger.error(`${err.name}: `, err);
});

// Main Error Handling
app.use((err, req, res, next) => {
  const { name, message, status = 500 } = err;
  serverLogger.error(`${name}: `, err);
  res.status(status);
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
