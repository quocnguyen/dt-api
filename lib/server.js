'use strict'

const http = require('http')
const router = require('./router')
const finalhandler = require('finalhandler')
const onRequest = (req, res) => {
  router(req, res, finalhandler)
}
const server = http.createServer(onRequest)

module.exports = server
