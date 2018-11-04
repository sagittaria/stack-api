var jwt = require('jsonwebtoken')
var config = require('../config')

let JwtVerifyFilter = (req, res, next)=>{
  // 有些路由不用验证jwt
  if (/^\/stack\/operator/.test(req.baseUrl)) {
    if (req.url === '/' && req.method === 'POST') { // 登陆dash
      return next()
    }
  }

  if (/^\/stack\/post/.test(req.baseUrl)) { // 关于posts的所有get请求
    if (req.method === 'GET') {
      return next()
    }
  }

  jwt.verify(req.header('X-token'), config.jwtKey, function(err, decoded){
    if (err) {
      return res.json({succeeded: false, message: err.message})
    }
    req.decoded = decoded
    next() // 如果token没问题，把decode结果set到req上，以便后面的middleware可直接取用
  })
}

module.exports = JwtVerifyFilter
