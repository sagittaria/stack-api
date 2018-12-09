var jwt = require('jsonwebtoken')
var fetch = require('node-fetch')
var express = require('express')
var router = express.Router()

var config = require('../config')
var Operator = require('../model').Operator

router.get('/signIn', function(req, res, next){
  let code = req.query.code
  let { client_id, client_secret } = config.github
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
    }).then(async (userInfo) => {
      var login = userInfo.login
      await Operator.findOne({ login }, (err, operator)=>{
        if(operator){
          var token = jwt.sign({exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), id: operator._id}, config.jwtKey) // 过期时间设为24hour
          res.json({succeeded: true, token})
        }else {
          // res.sendStatus(403)
          var message = 'login permission denied'
          res.json({succeeded: false, message})
        }
      })
    })
  }).catch(err => {
    res.json({succeeded: false, message: err})
  })
})

router.get('/', function(req, res, next){
  res.json({message: 'reached!', code: req.query.code, succeeded: true})
})

module.exports = router
