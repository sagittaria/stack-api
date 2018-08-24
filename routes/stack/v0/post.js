var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var config = require('../config')
mongoose.connect(config.dbURL);

var postSchema = mongoose.Schema({
    category: String,
    title: String,
    body: String,
    updatedAt: Date,
    tags: Array
})

var Post = mongoose.model('post', postSchema)

router.post('/', function(req, res, next) {
    // console.log(req.body)

    var p = new Post(req.body)
    p.save(function (err, p) {
        if(err) return console.error(err);
    })

    res.send('done')
});

router.get('/', function(req, res, next) {
    Post.find().sort({updatedAt: -1}).exec(function (err, posts){
        res.json(posts)
    })
})

router.get('/:id', function(req, res, next) {
    Post.findById(req.params.id, function(err, post){
        res.json(post)
    })
});

router.put('/:id', function(req, res, next){
    Post.findByIdAndUpdate(req.params.id, req.body, function(err, post){
        if(err) return console.error(err);
    })
    res.send('done')
})

router.delete('/:id', function(req, res, next){
    Post.findByIdAndDelete(req.params.id, req.body, function(err, post){
        if(err) return console.error(err);
    })
    res.send('done')
})

module.exports = router;
