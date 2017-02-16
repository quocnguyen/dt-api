'use strict'

const compression = require('compression')
const serveStatic = require('serve-static')
const helmet = require('helmet')
const csurf = require('csurf')
const cookieParser = require('cookie-parser')
const qs = require('querystring')
const url = require('url')
const consolidate = require('consolidate')
const {resolve} = require('path')

const DAY_IN_MILISECOND = 24 * 60 * 60 * 1000

// apply all middlewares needed for the app
module.exports = (app) => {
  // use gzip to reduce the size of assets
  app.use(
    compression({
      level: process.env.COMPRESSION_LEVEL || 1
    })
  )

  // assets
  let opt = {}
  if (process.env.NODE_ENV === 'production') {
    opt = {
      maxAge: DAY_IN_MILISECOND
    }
  }
  app.use(
    serveStatic(
      resolve(__dirname, '..', 'public'),
      opt
    )
  )

  // render
  app.use(
    (req, res, next) => {
      res.render = (filename, params = {}) => {
        const path = resolve(__dirname, '..', 'views', filename)
        res.locals = res.locals || {}
        consolidate.mustache(
          path,
          Object.assign(params, res.locals),
          (err, html) => {
            if (err) { throw err }
            res.setHeader('Content-Type', 'text/html; charset=utf8')
            res.end(html)
          }
        )
      }
      next()
    }
  )

  // query string
  app.use(
    (req, res, next) => {
      req.query = qs.parse(
        url.parse(req.url).query
      )
      next()
    }
  )

  // res.json
  app.use(
    (req, res, next) => {
      const json = (obj) => {
        return JSON.stringify(obj, null, 4)
      }

      res.json = (obj) => {
        res.setHeader('Content-Type', 'application/json; charset=utf8')
        res.end(
          json(obj)
        )
      }

      next()
    }
  )

  // parse body
  app.use((req, res, next) => {
    req.body = {}
    if (req.method !== 'POST') { return next() }

    let body = ''
    req.on('data', (buf) => {
      body += buf.toString()
    })
    req.on('end', () => {
      req.body = qs.parse(body)
      next()
    })
  })

  // enable cookie
  app.use(cookieParser())

  // helmet best practise protection
  app.use(helmet())

  // csrf protection
  app.use(
    csurf({
      cookie: true
    })
  )
  // assign csrfToken to view
  app.use(
    (req, res, next) => {
      res.locals = res.locals || {}
      res.locals.csrfToken = req.csrfToken()
      next()
    }
  )

  return app
}
