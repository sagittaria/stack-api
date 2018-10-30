var crypto = require('crypto')
var jwt = require('jsonwebtoken')

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var config = require('../config')
mongoose.connect(config.dbURL, {useNewUrlParser: true});

var operatorSchema = mongoose.Schema({
  username: String,
  password: String,
  roles: Array
})

var Operator = mongoose.model('operator', operatorSchema)

router.post('/', function(req, res, next) {
  let pwd = crypto.createHash('md5').update(req.body.password).digest('hex')
  Operator.findOne({username: req.body.username, password: pwd},(err, operator)=>{
    if(operator){
      var token = jwt.sign({exp: Math.floor(Date.now() / 1000) + (60 * 60), id: operator._id}, config.jwtKey) // 过期时间设为1hour
      res.json({ token })
    }else{
      res.sendStatus(403)
    }
  })
})

router.get('/', function(req, res, next){
  jwt.verify(req.header('X-token'), config.jwtKey, function(err, decoded){
    if(err) return console.error(err)
    Operator.findById(decoded.id, function(err, operator){
      res.json({roles: operator.roles})
    })
  })
})

module.exports = router;
