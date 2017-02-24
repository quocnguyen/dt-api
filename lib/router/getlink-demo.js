'use strict'

const extractFileId = require('../extractFileId')
const handleError = require('../handleError')
let getVideos = require('../get-videos')

module.exports = async (req, res) => {
  if (!req.body.contact_me_to_use_api_dont_do_this) {
    throw new Error('drive was missing')
  }
  try {
    const id = extractFileId(req.body.contact_me_to_use_api_dont_do_this)

    if (id === false) {
      throw new Error('drive was invalid')
    }

    if (id.toLowerCase() !== '0b7mb8rvfj1jcs2p0ty1mzutzdkk') {
      throw new Error('homepage only support my demo link, please contact me to use api')
    }

    const videos = await getVideos(id)
    res.render('home.html', {
      result: JSON.stringify(videos, null, 4)
    })
  } catch (err) {
    const errMsg = handleError(err)

    res.render('home.html', {
      result: errMsg
    })
  }
}
