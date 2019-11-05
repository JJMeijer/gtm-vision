/**
 * Express Router
 */

import express from 'express';
import request from 'request';
import jsdom from 'jsdom';

const router = express.Router();

/* POST GTM ID */
router.post('/api/gtm', (req, res, next) => {
  if (req.body && req.body.value) {
    const { value } = req.body;

    request(`https://www.googletagmanager.com/gtm.js?id=${value}`, (err, response, body) => {
      if (err) {
        next(err);
      } else if (body.match(/{\n"resource":\s{[\s\S]*,\n"runtime"/g)) {
        const containerText = body.match(/{\n"resource":\s{[\s\S]*,\n"runtime"/g)[0].replace(/,\n"runtime"/, '}');
        res.json(JSON.parse(unescape(containerText)));
      } else {
        const error = new Error('Not a Valid ID');
        error.status = 400;
        next(error);
      }
    });
  } else {
    const error = new Error('Missing post request body');
    error.status = 400;
    next(error);
  }
});

/* POST Website URL */
router.post('/api/www', (req, res, next) => {
  if (req.body && req.body.value) {
    try {
      const { value } = req.body;
      const options = {
        runScripts: 'dangerously',
        resources: 'usable',
      };

      const { JSDOM } = jsdom;

      // Not sure if JSDOM is best solution
      JSDOM.fromURL(value, options).then((dom) => {
        const gtmSources = Array.prototype.slice.call(dom.window.document.querySelectorAll('scripts[src*=gtm]'));
        console.log(gtmSources);
        res.json(JSON.parse({
          gtmSources,
        }));
      });
    } catch (err) {
      next(err);
    }
  }
});

export default router;
