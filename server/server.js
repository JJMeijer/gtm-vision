// Module Dependencies
import express from 'express';
import dotenv from 'dotenv';
import compression from 'compression';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import Bundler from 'parcel-bundler';

import routes from '../routes';

// use dotenv
dotenv.config({
  silent: true,
});

// initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// basic logger function
const log = function logMessages(message) {
  process.stdout.write(`[${new Date().toJSON()}] ${message}\n`);
};

// set view engine
app.set('views', './views');
app.set('view engine', 'pug');

// Morgan logger
app.use(logger('combined'));

// Use Compression
app.use(compression());

// serve static files
app.use(express.static('public'));

// use parcel bundler
if (process.env.NODE_ENV !== 'production') {
  const bundler = new Bundler('./src/index.js', {
    outDir: 'public',
    logLevel: 4,
  });

  bundler.bundle();

  app.use(bundler.middleware());
}

// use body and cookie parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

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
  res.render('error', {
    title: `${err.status} Error Page`,
    message: err.message,
    status: err.status,
  });
  next();
});

// Start Express app
app.listen(port, log(`Server is running on port: ${port}`));
