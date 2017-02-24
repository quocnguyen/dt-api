'use strict'

const callWorker = require('./call-worker')
const filter403Videos = require('./filter403Videos')
const getShortUrl = require('./getShortUrl')
const mem = require('mem')
const ONE_HOURS_IN_MILISECONDS = 1 * 60 * 60 * 1000

let getVideos = async (id) => {
  const result = await callWorker(id)
  if (result.status !== 'OK') {
    throw new Error(result.reason)
  }

  let videos = result.data
  videos = await filter403Videos(videos)
  const urls = await getShortUrl(
    videos.map(video => video.src)
  )

  return videos.map((video, index) => {
    delete video.provider
    video.src = urls[index]
    return {
      label: video.res,
      default: index === 0 ? 'true' : 'false',
      type: 'mp4',
      file: video.src
    }
  })
}

const cacheFn = mem(getVideos, {
  maxAge: ONE_HOURS_IN_MILISECONDS
})

module.exports = cacheFn

