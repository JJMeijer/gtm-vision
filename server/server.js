import express from 'express';
import compression from 'compression';
import morgan from 'morgan';
import { start as DebugStart } from '@google-cloud/debug-agent';

import apiRouter from './api-router';
import errorRouter from './error-router';
import { serverLogger } from './loggers';

// Init Google Cloud debugger agent
DebugStart();

// initialize Express app
const app = express();
const port = process.env.PORT || 3000;
const appFolder = 'public';

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
      write: message => serverLogger.info(message.trim()),
    },
  }));
}

// serve static files
app.use(express.static(appFolder));

// get always routes to site
app.get('*', (req, res) => {
  res.sendFile('index.html', { root: appFolder });
});

// Main routing
app.use('/', apiRouter);

// Front-end Error routing
app.use('/', errorRouter);

// 404 Handling
app.use((req, res, next) => {
  const err = new Error(`Could not resolve request path: ${req.method} ${req.originalUrl}`);
  err.status = 404;
  next(err);
});

// Main Error Handling
app.use((err, req, res, next) => {
  const { name, message, status = 500 } = err;
  res.status(status);
  res.json({
    message,
  });

  serverLogger.error(`${name}: `, err);

  next();
});

// Log uncaught Exceptions
process.on('uncaughtExceptionMonitor', err => serverLogger.error(err));

// Start Express app
serverLogger.info(`GTM insight running on port: ${port}`);
app.listen(port);
