'use strict'

// extract file id out of google drive share link
module.exports = (url) => {
  if (!url) return false
  if (url.toLowerCase().indexOf('drive.google.com') === -1) {
    return false
  }
  const found = url.match(/(?:https?:\/\/)?(?:[\w-]+\.)*(?:drive|docs)\.google\.com\/(?:(?:folderview|open|uc)\?(?:[\w\-%]+=[\w\-%]*&)*id=|(?:folder|file|document|presentation)\/d\/|spreadsheet\/ccc\?(?:[\w\-%]+=[\w\-%]*&)*key=)([\w-]{28,})/i)
  if (found === null) {
    return false
  }

  return found[1]
}
