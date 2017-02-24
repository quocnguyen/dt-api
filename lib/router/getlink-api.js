'use strict'

const extractFileId = require('../extractFileId')
const getVideos = require('../get-videos')
const handleError = require('../handleError')
const mem = require('mem')

module.exports = async (req, res, next) => {
  if (!req.query.drive) {
    return next()
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
    // ignore err like those
    const msg = err.toString()
    if (msg === "Error: You don't have permission to access this video" ||
      msg === "Error: This video doesn't exist.") {
      return res.json({
        status: 'FAIL',
        reason: err.toString()
      })
    }

    // clear only on my own err
    mem.clear(getVideos)
    res.json({
      err: handleError(err)
    })
  }
}
