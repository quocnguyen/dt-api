'use strict'

const got = require('got')
const possiblePromise = require('./possiblePromise')

module.exports = async (urls) => {
  const shorturlService = `${process.env.SHORT_URL_SERVICE}/batch`
  const p = got
    .post(shorturlService, {
      timeout: 1500,
      retries: 1,
      json: true,
      body: {urls}
    })
    .then(res => res.body.data)

  return possiblePromise(p, urls)
}
