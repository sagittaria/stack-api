var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var config = require('../config')
mongoose.connect(config.dbURL, {useNewUrlParser: true});

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
    let page = parseInt(req.query.page)
    let rows = parseInt(req.query.rows) > 50 ? 50 : parseInt(req.query.rows)

    getPosts(page, rows).then(posts => {
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

async function getPosts(page, rows) {
    let posts = {}
    posts.page = page
    posts.rows = rows
    posts.total = await Post.countDocuments({}, (err, count)=> count).catch(err => { console.log(err) })
    posts.list = posts.total > 0 ?
                    await Post.find({}, null, {sort: '-updatedAt' , skip: (page-1)*rows, limit: rows}, (err, docs) => docs)
                        .catch(err => { console.log(err) })
                    : []
    return posts
}

module.exports = router;
