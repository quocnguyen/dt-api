'use strict'

const extractAuthFromReq = require('basic-auth')

const basicAuth = (req, res, next) => {
  const user = extractAuthFromReq(req)
  if (
    !user ||
    user.name !== process.env.ADMIN_USERNAME ||
    user.pass !== process.env.ADMIN_PASSWORD
  ) {
    res.statusCode = 401
    res.setHeader('WWW-Authenticate', 'Basic realm="example"')
    return res.end('Access denied')
  }

  next()
}

module.exports = basicAuth
