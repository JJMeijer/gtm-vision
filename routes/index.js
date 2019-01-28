/**
 * Express Router Init
 */

import express from 'express'

const router = express.Router()

/* GET Homepage */
router.get('*', (req, res) => {
  res.render('index', {
    title: 'GTM Insight',
  })
})

export default router
