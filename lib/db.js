'use strict'

const level = require('level')
const defaults = require('levelup-defaults')
const bytewise = require('bytewise')
const db = level(process.env.ROOT + '/database')

module.exports = defaults(db, {
  keyEncoding: bytewise,
  valueEncoding: 'json'
})
