'use strict'

const got = require('got')
const log = require('./log')

module.exports = async (videos) => {
  const test = videos.filter(video => video.provider === 'drive')
  try {
    if (test.length === 0) { throw new Error('no video for provider drive') }
    log.info('checkout', test[0].src)
    await got.head(videos[0].src)
    videos = videos.filter(video => video.provider === 'drive')
    log.info('good')
  } catch (err) {
    log.info('die, backup to proxy')
    videos = videos.filter(video => video.provider === 'proxy')
  }

  return Promise.resolve(videos)
}
