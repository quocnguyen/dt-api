'use strict'

process.env.ROOT = __dirname
require('dotenv').config({silent: true})
const log = require('./lib/log')
const PORT = process.env.PORT || 6969
require('./lib/server').listen(PORT, () => {
  log.debug(`http://0.0.0.0:${PORT}`)
})
