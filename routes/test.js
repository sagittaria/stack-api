var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/stack');
var postSchema = mongoose.Schema({
    title: String,
    body: String
  })

var Post = mongoose.model('post', postSchema)

router.post('/save', function(req, res, next) {
  console.log(req.body)

  var p = new Post(req.body)
  p.save(function (err, p) {
    if(err) return console.error(err); 
  })

  res.json(req.body)
});

module.exports = router;
