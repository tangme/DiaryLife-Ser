var createError = require('http-errors');
var express = require('express');
const session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

global.reqlib = require('app-root-path').require;

const userControl = reqlib('/servers/userServer/userControl');
const loginControl = reqlib('/servers/loginServer/loginControl');

const whiteOriginList = ['http://localhost:8043'];

const SESSION_STORE = reqlib('/SESSION_STORE');

var app = express();

app.use(session({
    ////这里的name值得是cookie的name，默认cookie的name是：connect.sid
    name: 'connect.sid',
    secret: 'keyboard cat',
    cookie: ('name', 'value', { path: '/', httpOnly: true, secure: false, maxAge: 60 * 1000 }),
    //重新保存：强制会话保存即使是未修改的。默认为true但是得写上
    resave: true,
    //强制“未初始化”的会话保存到存储。 
    saveUninitialized: true,

}));

//设置跨域访问
app.all('*', function(req, res, next) {
    if (whiteOriginList.some(function(item) {
            return item == req.headers.origin;
        })) {
        res.header("Access-Control-Allow-Origin", req.headers.origin);
    }
    res.header("Access-Control-Allow-Credentials", "true");

    res.header("Access-Control-Allow-Headers", "content-type,timestamp,tanglv");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    /*res.header("Content-Type", "application/json;charset=utf-8");*/
    if(typeof SESSION_STORE[req.sessionID] != 'undefined'){
        console.log('有SESSION'); 
    }else{
        console.log('没有SESSION');
    }
    next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/server', loginControl);
app.use('/user', userControl)

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