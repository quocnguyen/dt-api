// a very simple transporter that help us
// push error coming from stdin to bugsnap
'use strict'

require('dotenv').config({silent: true})
const bugsnap = require('bugsnag')
const split = require('split2')
const through = require('through2')
const Parse = require('fast-json-parse')
const util = require('util')

bugsnap.register(process.env.BUGSNAG_API)

// test if the line is actually in pino log format
// taken from https://github.com/mcollina/pino/blob/master/pretty.js#49
function isPinoLine (line) {
  return line.hasOwnProperty('hostname') && line.hasOwnProperty('pid') && (line.hasOwnProperty('v') && line.v === 1)
}

function mapLine (line) {
  var parsed = Parse(line)
  var value = parsed.value
  if (parsed.err || !isPinoLine(value)) {
    // pass through
    return line + '\n'
  }
  return value
}
let tranform = through.obj(function (record, enc, cb) {
  // if record is not object, it properly not what we want
  if (!util.isObject(record)) {
    return cb(null, record)
  }

  // make this stream a pass through if we are not in production
  if (process.env.NODE_ENV !== 'production') {
    return cb(null, JSON.stringify(record) + '\n')
  }

  // we also do nothing if this record is not an error
  if (record.level < 50) {
    return cb(null, JSON.stringify(record) + '\n')
  }

  // create a err instance but use the stack trace from the record
  let err = new Error(record.msg + ' ' + record.requestId)
  err.stack = record.stack

  // kick off
  bugsnap.notify(err, {
    subsystem: {
      requestId: record.requestId
    }
  })

  // ready to process the next one
  cb(null, JSON.stringify(record) + '\n')
})

process.stdin
  .pipe(split(mapLine))
  .pipe(tranform)
  .pipe(process.stdout)
