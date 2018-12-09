var crypto = require('crypto')
var jwt = require('jsonwebtoken')
var express = require('express')
var router = express.Router()

var jvf = require('./JwtVerifyFilter')
var ee = require('./ErrorEnum')
var config = require('../config')
var Operator = require('../model').Operator

router.use(jvf) // middleware specified for this router

var captcha = require('../config').captcha
router.get('/getCaptcha', function(req, res, next){
  // 向极验申请每次验证所需的challenge
  captcha.register(null, function (err, data) {
    if (err) {
      console.error(err)
      var message = ee.getPhrase(5001)
      return res.json({succeeded: false, message})
    }

    if (!data.success) {
      // 进入 failback，如果一直进入此模式，请检查服务器到极验服务器是否可访问
      // 可以通过修改 hosts 把极验服务器 api.geetest.com 指到不可访问的地址

      // 为以防万一，你可以选择以下两种方式之一：

      // 1. 继续使用极验提供的failback备用方案
      req.session.fallback = true; // TODO
      res.json({succeeded: true, data});

      // 2. 使用自己提供的备用方案
      // todo

    } else {
      // 正常模式
      req.session.fallback = false; // TODO
      res.json({succeeded: true, data});
    }
  })
})

router.post('/', function(req, res, next) {
  captcha.validate(req.session.fallback, {
    geetest_challenge: req.body.geetest_challenge,
    geetest_validate: req.body.geetest_validate,
    geetest_seccode: req.body.geetest_seccode
  }, function (err, success) {
    if (err) {// 网络错误
      return res.json({succeeded: false, message: err.message})
    } else if (!success) {// 二次验证失败
      var message = ee.getPhrase(5002)
      return res.json({succeeded: false, message})
    }
    // 上面顺利通过之后再去校验用户名和密码
    let pwd = crypto.createHash('md5').update(req.body.password).digest('hex')
    Operator.findOne({username: req.body.username, password: pwd},(err, operator)=>{
      if(operator){
        var token = jwt.sign({exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), id: operator._id}, config.jwtKey) // 过期时间设为24hour
        res.json({succeeded: true, token})
      }else{
        // res.sendStatus(403)
        var message = ee.getPhrase(4001)
        res.json({succeeded: false, message})
      }
    })
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
