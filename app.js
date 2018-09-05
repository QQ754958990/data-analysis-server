var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

var apiRouter = require('./routes/api')

var express_app = express()

// view engine setup
express_app.set('views', path.join(__dirname, 'views'))
express_app.set('view engine', 'ejs')

express_app.use(logger('dev'))
express_app.use(express.json())
express_app.use(express.urlencoded({extended: false}))
express_app.use(cookieParser())
express_app.use(express.static(path.join(__dirname, 'public')))

express_app.use('/api', apiRouter)

// catch 404 and forward to error handler
express_app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
express_app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.express_app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = express_app
