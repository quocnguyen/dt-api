'use strict'

const got = require('got')
const qs = require('querystring')
const possiblePromise = require('./possiblePromise')

// module.exports = async (url) => {
//   const shorturlService = `${process.env.SHORT_URL_SERVICE}/api?url=${qs.escape(url)}`
//   const p = got(shorturlService, { json: true }).then(response => response.body.data)
//   return possiblePromise(p, url)
// }

module.exports = async (urls) => {
  const shorturlService = `${process.env.SHORT_URL_SERVICE}/batch`
  const p = got
    .post(shorturlService, {
      json: true,
      body: {urls}
    })
    .then(res => res.body.data)

  return possiblePromise(p, urls)
}
