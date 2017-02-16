'use strict'
const logger = require('pino')({
  name: 'api'
})
logger.level = process.env.LOG_LEVEL || 'debug'

module.exports = logger
