'use strict'

// promise that never reject
// it will resolve to defaultValue on error
const log = require('./log')

module.exports = async (p, defaultValue = null) => {
  return new Promise(resolve => {
    p.then(resolve).catch(err => {
      log.error(err)
      resolve(defaultValue)
    })
  })
}
