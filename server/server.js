// Module Dependencies
import express from 'express';
import compression from 'compression';
import logger from 'morgan';
import Bundler from 'parcel-bundler';

import routes from '../routes';

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

// basic logger function
const log = function logMessages(message) {
  process.stdout.write(`[${new Date().toJSON()}] ${message}\n`);
};

// serve static files
app.use(express.static(appFolder));

// get always routes to site
app.get('*', (req, res) => {
  res.sendFile('index.html', { root: appFolder });
});

// Main routing
app.use('/', routes);

// 404 Handling
app.use((req, res, next) => {
  log(`No response available for request path: "${req.path}"`);
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Main Error Handling
app.use((err, req, res, next) => {
  log(err.stack);
  res.status(err.status || 500);
  res.send(err.message);
  next();
});

// use parcel bundler
if (process.env.NODE_ENV !== 'production') {
  const bundler = new Bundler('./src/index.html', {
    outDir: appFolder,
    logLevel: 4,
    minify: true,
  });

  app.use(bundler.middleware());
}

// Start Express app
app.listen(port, log(`Server is running on port: ${port}`));
