// Module Dependencies
import express from 'express';
import compression from 'compression';
import logger from 'morgan';
import Bundler from 'parcel-bundler';

import router from './routes';

// initialize Express app
const app = express();
const port = process.env.PORT || 3000;
const appFolder = 'public';

// use compression
app.use(compression());

// Bodyparser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Morgan logger
app.use(logger('combined'));

// serve static files
app.use(express.static(appFolder));

// get always routes to site
app.get('*', (req, res) => {
  res.sendFile('index.html', { root: appFolder });
});

// Main routing
app.use('/', router);

// 404 Handling
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Main Error Handling
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send(err.message);
  next();
});

// use parcel bundler
if (process.env.NODE_ENV !== 'production') {
  const bundler = new Bundler('./src/index.html', {
    outDir: appFolder,
    logLevel: 4,
  });

  app.use(bundler.middleware());
}

// Start Express app
app.listen(port);
