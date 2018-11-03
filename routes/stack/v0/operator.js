var crypto = require('crypto')
var jwt = require('jsonwebtoken')
var jvf = require('./JwtVerifyFilter')

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var config = require('../config')
mongoose.connect(config.dbURL, {useNewUrlParser: true});

var ee = require('./ErrorEnum')

var operatorSchema = mongoose.Schema({
  username: String,
  password: String,
  roles: Array
})

var Operator = mongoose.model('operator', operatorSchema)

router.use(jvf) // middleware specified for this router

router.post('/', function(req, res, next) {
  let pwd = crypto.createHash('md5').update(req.body.password).digest('hex')
  Operator.findOne({username: req.body.username, password: pwd},(err, operator)=>{
    if(operator){
      var token = jwt.sign({exp: Math.floor(Date.now() / 1000) + (60 * 60), id: operator._id}, config.jwtKey) // 过期时间设为1hour
      res.json({succeeded: true, token})
    }else{
      // res.sendStatus(403)
      var message = ee.getPhrase(4001)
      res.json({succeeded: false, message})
    }
  })
})

router.get('/', function(req, res, next){
  var decoded = req.decoded // 如果jvf顺利通过了，那么req上会被set一个token-decoded
  Operator.findById(decoded.id, function(err, operator){
    if(operator){
      res.json({succeeded: true, roles: operator.roles})
    }else{
      res.json({succeeded: false, message: err.message || ee.getPhrase(4002)})
    }
  })
})

module.exports = router;
