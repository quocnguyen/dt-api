'use strict'

const Pool = require('wrr-pool')
const db = require('./db')
const through2 = require('through2')
const log = require('./log')
const pool = new Pool()

db.createReadStream({
  gt: ['worker', null],
  lt: ['worker', undefined],
  keys: false
})
.pipe(through2.obj((worker, enc, next) => {
  pool.add(worker, worker.score || 1000)
  next()
}))

db.on('del', (key) => {
  if (key[0] !== 'worker') return
  log.info('remove worker', key)
  try {
    pool.remove(worker => worker.id === key[1])
  } catch (err) {
    // ignore err since it is an external lib
  }
})

db.on('put', (key, worker) => {
  if (key[0] !== 'worker') return
  log.info('add worker', worker)
  pool.add(worker, worker.score || 1000)
})

module.exports = pool
