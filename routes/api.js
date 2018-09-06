var express = require('express')
var router = express.Router()
var path = require('path')
var xss = require('xss')
var token = require('../public/javascripts/tool/token')

// 引入 events 模块
var events = require('events')
// 创建 eventEmitter 对象
var eventEmitter = new events.EventEmitter()

var xss_parse = function (source) {
  if(!source) return {}

  if(source.length >=0){
    for(var i = 0;i<=source.length;i++){
      xss_parse(source[i])
    }
  }else {
    for(var key in source){
      if(source.hasOwnProperty(key)){
        var value = source[key]
        if(typeof value === 'string' || typeof value === 'number'){
          source[key] = xss(value)
          return source
        }else {
          xss_parse(value)
        }
      }
    }
  }
}

router.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization,\'Origin\',Accept,X-Requested-With')
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.header('Access-Control-Allow-Credentials', true)
  res.header('X-Powered-By', ' nodejs')
  res.header('Content-Type', 'application/json;charset=utf-8')
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
  } else {
    var result = req.url.search(/\/login|\/add_user/i) !== -1
    if (result) {
      next()
    } else {
      var get_args = token.get_args(req.query.token)
      if (token.validate(get_args)) {
        var keys = Object.keys(req.body)
        req.body = xss_parse(JSON.parse(keys[0])) //xss验证
        next()
      } else {
        res.sendStatus(401)
      }
    }
  }
})

/*db.listCollections({name: 'demo'})
    .next(function (err, collinfo) {
      if (collinfo) {
        // The collection exists
      }
    })*/

/*dbase.createCollection(req.body['file_name'], function (err, res) {
 console.log('创建集合!')
})*/

router.post('/login', function (req, res, next) {
  db.collection('users').find(req.body).toArray(function (err, result) {
    if (err) throw err

    if (result.length > 0) {
      token.source_args = req.body
      var token_str = token.set_token(req.body)
      res.end(JSON.stringify({
        token: token_str,
        content: result
      }))
    } else {
      res.end(JSON.stringify({
        content: result
      }))
    }
  })
})

router.post('/add_user', function (req, res, next) {
  db.collection('users').insertOne(req.body, function (err, result) {
    if (err) throw err
    res.end(JSON.stringify(result))
  })
})

router.post('/save_data', function (req, res, next) {
  db.collection('data').find({
    'file_name': req.body['file_name']
  }).toArray(function (err, result) {
    if (err) throw err

    req.body['uid'] = token.source_args['user_id']

    if (result[0]) {
      db.collection('data').updateOne(result[0], {$set: req.body}, function (err, result) {
        if (err) throw err
        res.end(JSON.stringify(result))
      })
    } else {
      db.collection('data').insertOne(req.body, function (err, result) {
        if (err) throw err
        res.end(JSON.stringify(result))
      })
    }
  })

})

router.post('/data_list', function (req, res, next) {
  var token_str = req.query.token
  var uid = token.get_args(token_str)['user_id']

  db.collection('data').find({uid: uid}).toArray(function (err, result) {
    if (err) throw err

    res.end(JSON.stringify({
      content: result
    }))
  })

})

router.post('/delete_data', function (req, res, next) {

  db.collection('data').deleteOne(req.body, function (err, obj) {
    if (err) throw err
    res.end(JSON.stringify({
      content: obj
    }))
  })

})

module.exports = router
