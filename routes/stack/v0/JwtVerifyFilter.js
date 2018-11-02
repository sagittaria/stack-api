var jwt = require('jsonwebtoken')
var config = require('../config')

let JwtVerifyFilter = (req, res, next)=>{
  jwt.verify(req.header('X-token'), config.jwtKey, function(err, decoded){
    if (err) {
      return res.json({succeeded: false, message: err.message})
    }
    req.decoded = decoded
    next() // 如果token没问题，把decode结果set到req上，以便后面的middleware可直接取用
  })
}

module.exports = JwtVerifyFilter