'use strict'

const extractFileId = require('../extractFileId')
let getVideos = require('../get-videos')
const handleError = require('../handleError')
const mem = require('mem')
const ONE_HOURS_IN_MILISECONDS = 1 * 60 * 60 * 1000
const FIFTEEN_MINUTES_IN_MILISECONDS = 15 * 60 * 1000

module.exports = async (req, res, next) => {
  if (!req.query.drive) {
    return next()
  }

  if (Number(process.env.ALLOW_CACHE) === 1) {
    let ttl = Number(req.query.ttl) || ONE_HOURS_IN_MILISECONDS
    if (ttl < FIFTEEN_MINUTES_IN_MILISECONDS) {
      ttl = FIFTEEN_MINUTES_IN_MILISECONDS
    }

    getVideos = mem(getVideos, {
      maxAge: ttl
    })
  }

  try {
    const id = extractFileId(req.query.drive)
    if (id === false) {
      return res.json({
        status: 'FAIL',
        reason: 'drive invalid'
      })
    }

    let videos = await getVideos(id)

    res.json(videos)
  } catch (err) {
    mem.clear(getVideos)
    res.json({
      err: handleError(err)
    })
  }
}
