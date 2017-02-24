'use strict'

const db = require('../db')

module.exports = (req, res, next) => {
  if (!req.query.drive) return next()

  if (!req.query.apikey) {
    return res.json({
      status: 'FAIL',
      reason: 'missing apikey'
    })
  }

  db.get(['apikey', req.query.apikey], (err, value) => {
    if (err || value === null) {
      return res.json({
        status: 'FAIL',
        reason: 'invalid apikey, contact https://www.facebook.com/quocnguyenclgt to get apikey'
      })
    }

    let requestTotal = value.requestTotal || 0

    // update apikey stat
    db.put(['apikey', req.query.apikey], Object.assign(value, {
      requestTotal: requestTotal + 1
    }))

    next()
  })
}
