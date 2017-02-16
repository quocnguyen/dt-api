'use strict'

const extractFileId = require('../extractFileId')
const handleError = require('../handleError')
const getVideos = require('../get-videos')
const mem = require('mem')

module.exports = async (req, res) => {
  if (!req.body.drive) {
    throw new Error('drive was missing')
  }
  try {
    const id = extractFileId(req.body.drive)

    if (id === false) {
      throw new Error('drive was invalid')
    }

    const videos = await getVideos(id)
    res.render('home.html', {
      result: JSON.stringify(videos, null, 4)
    })
  } catch (err) {
    mem.clear(getVideos)
    const errMsg = handleError(err, req.id)
    res.render('home.html', {
      result: errMsg
    })
  }
}
