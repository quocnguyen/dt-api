'use strict'

const cuid = require('cuid')
const db = require('../db')
const through2 = require('through2')
const isDomain = require('is-domain')

const list = (req, res, next) => {
  const apikeys = []
  db.createReadStream({
    gt: ['apikey', null],
    lt: ['apikey', undefined],
    keys: false
  })
  .on('end', () => {
    res.statusCode = 200
    res.render('apikey/list.html', {
      apikeys: apikeys
    })
  })
  .pipe(through2.obj((row, enc, next) => {
    apikeys.push(row)
    next()
  }))
}

const create = (req, res, next) => {
  if (
    !req.query.domain ||
    isDomain(req.query.domain) === false
  ) {
    return res.end('domain invalid')
  }

  // generate 25 char apikey
  const id = cuid()

  db.put(['apikey', id], {
    apikey: id,
    created: Date.now(),
    domain: req.query.domain
  })

  res.render('apikey/create.html', {
    apikey: id
  })
}

const remove = (req, res, next) => {
  const id = req.params.id
  db.del(['apikey', id])
  res.render('apikey/remove.html', {
    id: id
  })
}

exports.list = list
exports.create = create
exports.remove = remove
