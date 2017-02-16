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
      return res.json({err: 'drive invalid'})
    }
    let videos = await getVideos(id)

    res.json(videos.map((video, idx) => {
      return {
        label: video.res,
        default: idx === 0 ? 'true' : 'false',
        type: 'mp4',
        file: video.src
      }
    }))
  } catch (err) {
    mem.clear(getVideos)
    res.json({
      err: handleError(err, req.id)
    })
  }
}
