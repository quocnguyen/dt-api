'use strict'

const got = require('got')

module.exports = async (videos) => {
  try {
    await got.head(videos[0].src)
    videos = videos.filter(video => video.provider === 'drive')
  } catch (err) {
    videos = videos.filter(video => video.provider === 'proxy')
  }

  return Promise.resolve(videos)
}
