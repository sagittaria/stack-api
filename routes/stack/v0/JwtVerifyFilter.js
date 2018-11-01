var jwt = require('jsonwebtoken')
var config = require('../config')

let JwtVerifyFilter = (req, res, next)=>{
  jwt.verify(req.header('X-token'), config.jwtKey, function(err, decoded){
    if (err) {
      return res.json({succeeded: false, message: err.message})
    }
    next()
  })
}

module.exports = JwtVerifyFilter