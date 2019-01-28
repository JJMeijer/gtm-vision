// Module Dependencies
import express from 'express'
import routes from '../routes'

// Initialize App
const app = express()
const port = process.env.PORT || 3000

// Global app Settings
app.set('views', './views')
app.set('view engine', 'pug')

// Logger Function
const log = (message) => {
  process.stdout.write(`[${new Date().toJSON()}] ${message}\n`)
  console.log(`[${new Date().toJSON()}] ${message}\n`)
}

// Main routing
app.use('/', routes)

// 404 Handling
app.use((req, res, next) => {
  log(`No response available for request path: "${req.path}"`)
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// Main Error Handling
app.use((err, req, res, next) => {
  log(err.stack)
  res.status(err.status || 500)
  res.render('error', {
    title: `${err.status} Error Page`,
    message: err.message,
    status: err.status,
  })
  next()
})

// Start Express app
app.listen(port, log(`Server is running on port: ${port}`))
