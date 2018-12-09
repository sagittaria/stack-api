var mongoose = require('mongoose');
var operatorSchema = require('./operator')
var postSchema = require('./post')
var config = require('../config')

mongoose.connect(config.dbURL, {useNewUrlParser: true});

var Operator = mongoose.model('operator', mongoose.Schema(operatorSchema))
var Post = mongoose.model('post', mongoose.Schema(postSchema))

module.exports = { Operator, Post }