'use strict'

const log = require('./log')
const cuid = require('cuid')
module.exports = (err) => {
  err.requestId = cuid()
  log.error(err)
  return `Có lỗi xảy ra, lỗi của bạn có số ${err.requestId} - hãy báo admin để giải quyết`
}
