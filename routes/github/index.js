var jwt = require('jsonwebtoken')
var fetch = require('node-fetch')
var config = require('./config')
var express = require('express')
var router = express.Router()

router.get('/signIn', function(req, res, next){
  let code = req.query.code
  let { client_id, client_secret } = config
  const params = { client_id, client_secret, code}
  fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json'
    },
    body: JSON.stringify(params)
  }).then(resp => {
    return resp.json()
  }).then(json => {
    if (!json.error) {
      return json.access_token
    } else {
      return Promise.reject(json.error_description)
    }
  }).then(async (accessToken) => {
    await fetch(`https://api.github.com/user?access_token=${accessToken}`).then(resp => {
      return resp.json()
    }).then(userInfo => {
      res.json({succeeded: true, login: userInfo.login})
    })
  }).catch(err => {
    res.json({succeeded: false, message: err})
  })
})

router.get('/', function(req, res, next){
  res.json({message: 'reached!', code: req.query.code, succeeded: true})
})

module.exports = router
