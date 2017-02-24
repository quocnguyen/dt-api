'use strict'

const log = require('./log')
const cuid = require('cuid')
module.exports = (err) => {
  err.requestId = cuid()
  const msg = `Error number: ${err.requestId} - please contact admin \n
Reason could be: ${err.toString()}`

  if (
    err.message !== 'drive was invalid' ||
    err.message !== 'homepage only support my demo link, please contact me to use api'
  ) {
    log.error(err)
  }

  return msg
}
