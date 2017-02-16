'use strict'

const extractFileId = require('../extractFileId')
const handleError = require('../handleError')
let getVideos = require('../get-videos')
const HALF_HOURS_IN_MILISECONDS = 0.5 * 60 * 60 * 1000
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

    if (Number(process.env.ALLOW_CACHE) === 1) {
      getVideos = mem(getVideos, {
        maxAge: HALF_HOURS_IN_MILISECONDS
      })
    }

    const videos = await getVideos(id)
    res.render('home.html', {
      result: JSON.stringify(videos, null, 4)
    })
  } catch (err) {
    mem.clear(getVideos)
    const errMsg = handleError(err)

    res.render('home.html', {
      result: errMsg
    })
  }
}
