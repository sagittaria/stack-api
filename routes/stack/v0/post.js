var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var config = require('../config')
var jvf = require('./JwtVerifyFilter')

mongoose.connect(config.dbURL, {useNewUrlParser: true});

var postSchema = mongoose.Schema({
    category: String,
    title: String,
    body: String,
    updatedAt: Date,
    tags: Array
})

var Post = mongoose.model('post', postSchema)

router.use(jvf)

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
    let size = parseInt(req.query.size) > 50 ? 50 : parseInt(req.query.size)

    getPosts(page, size).then(posts => {
        res.json({ ...posts, succeeded: true })
    })
})

router.get('/cache', function(req, res, next){
  // TODO: 这个地方应该去研究下aggregate再回来改写！
  Post.find({}, (err, docs) => {
    let cachedStuff = {
      categoryCount: {
        idea: 0,
        tech: 0,
        other: 0
      },
      tagsCount: []
    }
    let tagsCountMap = new Map()
    docs.forEach(p => {
      cachedStuff.categoryCount[p.category]++
      p.tags.forEach(t => {
        let cnt = tagsCountMap.has(t) ? tagsCountMap.get(t) : 0
        tagsCountMap.set(t, ++cnt)
      })
    })
    cachedStuff.tagsCount = map2arr(tagsCountMap)
    res.json(cachedStuff)
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
        res.send('done')
    })
})

router.delete('/:id', function(req, res, next){
    Post.findByIdAndDelete(req.params.id, req.body, function(err, post){
        if(err) return console.error(err);
        res.send('done')
    })
})

async function getPosts(page, size) {
    let posts = {}
    posts.page = page
    posts.size = size
    posts.total = await Post.countDocuments({}, (err, count)=> count).catch(err => { console.log(err) })
    posts.list = posts.total > 0 ?
                    await Post.find({}, null, {sort: '-updatedAt' , skip: (page-1)*size, limit: size}, (err, docs) => docs)
                        .catch(err => { console.log(err) })
                    : []
    return posts
}

function map2arr(m) {
  let arr = [] // TODO 这里也应该可以重写
  for (let [k,v] of m) {
    arr.push({tag: k, cnt: v})
  }
  return arr;
}

module.exports = router;
