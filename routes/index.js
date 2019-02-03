/**
 * Express Router
 */

import express from 'express';
import urllib from 'urllib';

const router = express.Router();

/* GET Main Page */
router.get('*', (req, res) => {
  res.render('index', {
    title: 'GTM Insight',
  });
});

/* Post GTM Form */
router.post('/api/gtm', (req, res, next) => {
  if (req.body && req.body.value) {
    const { value } = req.body;
    urllib.request(`https://www.googletagmanager.com/gtm.js?id=${value}`, {
      dataType: 'text',
    },
    (err, data) => {
      if (err) {
        next(err);
      } else {
        const containerText = data.match(/{\n"resource":\s{[\s\S]*,\n"runtime"/g)[0].replace(/,\n"runtime"/, '}');
        res.json(JSON.parse(unescape(containerText)));
      }
    });
  } else {
    const error = new Error('Missing post request body');
    error.httpStatusCode = 400;
    next(error);
  }
});

export default router;
