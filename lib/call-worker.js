'use strict'
const pool = require('./pool')
const got = require('got')
const log = require('./log')

module.exports = async (id) => {
  const worker = pool.next()
  log.info('call worker', worker)

  return got(`${worker.url}/drive/${id}`, {
    json: true,
    timeout: 3000,
    retries: 1,
    headers: {
      'X-REQUEST-SECRET': worker.secret
    }
  })
  .then(response => response.body)
}
