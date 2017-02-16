'use strict'

const db = require('../db')
const through2 = require('through2')
const cuid = require('cuid')

const handleCreate = (req, res, next) => {
  try {
    const worker = req.body
    if (!worker.name) {
      throw new Error('name missing')
    }

    if (!worker.url) {
      throw new Error('url missing')
    }

    if (!worker.secret) {
      throw new Error('secret missing')
    }
    worker.id = cuid()
    delete worker._csrf
    db.put(['worker', worker.id], worker)
    res.locals.success = true
  } catch (err) {
    res.locals.err = true
  }

  next()
}

const renderCreateForm = (req, res, next) => {
  res.render('worker/create.html')
}

const renderList = (req, res, next) => {
  const workers = []
  db.createReadStream({
    gt: ['worker', null],
    lt: ['worker', undefined],
    keys: false
  })
  .on('end', () => {
    res.render('worker/list.html', {
      workers: workers
    })
  })
  .pipe(through2.obj((row, enc, next) => {
    workers.push(row)
    next()
  }))
}

const remove = (req, res, next) => {
  const id = req.params.id
  db.del(['worker', id])
  res.render('worker/remove.html', {
    id: id
  })
}

exports.renderCreateForm = renderCreateForm
exports.renderList = renderList
exports.handleCreate = handleCreate
exports.remove = remove
