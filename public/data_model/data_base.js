var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://localhost:27017/'

module.exports = function (callfn) {
  MongoClient.connect(url, function (err, database) {
    console.log('数据库已连接!')
    callfn(err, database.db("analysis"))
    //db.close();
  })
}