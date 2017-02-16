'use strict'

const callWorker = require('./call-worker')
const filter403Videos = require('./filter403Videos')
const possiblePromise = require('./possiblePromise')
const getShortUrl = require('./getShortUrl')
const mem = require('mem')
const THREE_HOURS_IN_MILISECONDS = 3 * 60 * 60 * 1000

const getVideos = async (id) => {
  let videos = await callWorker(id)
  videos = await filter403Videos(videos)
  const urls = await getShortUrl(
    videos.map(video => video.src)
  )

  return videos.map((video, index) => {
    delete video.provider
    video.src = urls[index]
    return video
  })
}
const cache = mem(getVideos, {
  maxAge: THREE_HOURS_IN_MILISECONDS
})

module.exports = cache
