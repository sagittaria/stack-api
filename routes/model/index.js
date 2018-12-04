var mongoose = require('mongoose');
var config = require('../stack/config')

mongoose.connect(config.dbURL, {useNewUrlParser: true});

var operatorSchema = mongoose.Schema({
  username: String,
  password: String,
  roles: Array,
  login: String // github用户名
})
var Operator = mongoose.model('operator', operatorSchema)

var postSchema = mongoose.Schema({
  category: String,
  title: String,
  body: String,
  updatedAt: Date,
  tags: Array
})
var Post = mongoose.model('post', postSchema)

module.exports = { Operator, Post }