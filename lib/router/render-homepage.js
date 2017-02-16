'use strict'

module.exports = (req, res, next) => {
  res.render('home.html', {
    logo: 'http://i.imgur.com/NP4giK1.jpg'
  })
}
