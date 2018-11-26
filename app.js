var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var session = require('express-session')

var bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var stackPostRouter = require('./routes/stack/v0/post');
var stackOperatorRouter = require('./routes/stack/v0/operator');

var app = express();

// 给captcha用到
app.use(session({
  secret: 'whatever',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

// 处理表单的
app.use(bodyParser.urlencoded({ extended: true }));

// 设置允许跨域
app.use(cors({origin: ['https://sagittaria.github.io', 'https://kasoya.github.io'], credentials: true}))
// 即便用nginx做反向代理，这里仍需要设置允许跨域的origin

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/stack/post', stackPostRouter);
app.use('/stack/operator', stackOperatorRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
