var createError = require('http-errors');
var express = require('express');
var expressWs = require('express-ws');//websocket中间介
const session = require('express-session');//session中间介
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http = require('http');

var fs = require("fs"); //操作文件
var multer = require("multer"); //处理上传文件
var upload = multer({
    dest: './uploads'
}); //定义图片上传的临时目录


global.reqlib = require('app-root-path').require;//导包插件

const userControl = reqlib('/servers/userServer/userControl');//用户信息
const loginControl = reqlib('/servers/loginServer/loginControl');//登录登出
const todoControl = reqlib('/servers/todoServer/todoControl');//待办
const publicControl = reqlib('/servers/publicServer/publicControl');//公共开放接口


const whiteOriginList = ['http://localhost:8043','http://localhost:8080'];//可访问 host 白名单

const NOT_FILTER_URL_MAP = new Map();//不进行过滤限制url
NOT_FILTER_URL_MAP.set('/server/login', '/server/login');
NOT_FILTER_URL_MAP.set('/server/logout', '/server/logout');
NOT_FILTER_URL_MAP.set('/server/register', '/server/register');

const NOT_FILTER_URL_ARR = new Array();//不进行过滤限制url
NOT_FILTER_URL_ARR.push('/uploads');
NOT_FILTER_URL_ARR.push('/public');

const SESSION_STORE = reqlib('/SESSION_STORE');

var app = express();
var server = http.createServer(app);
global.expressWs = expressWs(app, server);
global.WS_MAP = new Map()


function isOKPath(path){
    return NOT_FILTER_URL_ARR.some(item=>{
        return path.indexOf(item)==0
    });
}
/**
 * [websocket]
 * @author tanglv 2018-08-09
 */
app.ws('/notification', function(ws, req) {
    console.log(`websocket connect success,socketid is: ${req.query.socketid}`);
    ws.send(`WebSocket Message from Server,socketid is: ${req.query.socketid}`);
    ws.on('close',()=>{
        console.log(`websocket closed,socketid is: ${req.query.socketid}`);
    });
    ws.on('message', function(msg) {
        console.log(msg);
    });
    WS_MAP.set(req.query.socketid, ws);
});

app.use(session({
    ////这里的name值得是cookie的name，默认cookie的name是：connect.sid
    name: 'connect.sid',
    secret: 'keyboard cat',
    cookie: ('name', 'value', { path: '/', httpOnly: true, secure: false, maxAge: 60 * 60 * 1000 }),
    //重新保存：强制会话保存即使是未修改的。默认为true但是得写上
    resave: true,
    //强制“未初始化”的会话保存到存储。 
    saveUninitialized: true,

}));

/**
 * [设置跨域访问]
 * @author tanglv 2018-08-08
 */
app.all('*', function(req, res, next) {
    if (whiteOriginList.some(function(item) {
            return item == req.headers.origin;
        })) {
        res.header("Access-Control-Allow-Origin", req.headers.origin);
    }
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "X-Token, Content-Type, Content-Length, Authorization, Accept, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    //res.header("Content-Type", "application/json;charset=utf-8");
    if (req.method == 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

/**
 * [拦截器]
 * @author tanglv 2018-08-08
 */
app.all('*', function(req, res, next) {
    if (typeof SESSION_STORE[req.sessionID] != 'undefined' || NOT_FILTER_URL_MAP.has(req.path) || isOKPath(req.path)) {
        next();
    } else {
        res.status(403).json({ "msg": "会话已过期，请重新登录" });
    }
});


// 单域多文件上传：input[file]的 multiple=="multiple"
app.post('/uploads', upload.array('imageFile', 5), function(req, res, next) {
    // req.files 是 前端表单name=="imageFile" 的多个文件信息（数组）,限制数量5，应该打印看一下
    for (let i = 0; i < req.files.length; i++) {
        // 图片会放在uploads目录并且没有后缀，需要自己转存，用到fs模块
        // 对临时文件转存，fs.rename(oldPath, newPath,callback);
        fs.rename(req.files[i].path, "uploads/" + req.files[i].originalname, function(err) {
            if (err) {
                throw err;
            }
            console.log('done!');
        })
    }

    /*res.writeHead(200, {
        "Access-Control-Allow-Origin": "*" //允许跨域。。。
    });*/
    // req.body 将具有文本域数据, 如果存在的话
    res.end(JSON.stringify(req.files) + JSON.stringify(req.body));
})

// 单域单文件上传：input[file]的 multiple != "multiple"
app.post('/upload', upload.single('imageFile'), function(req, res, next) {
    // req.file 是 前端表单name=="imageFile" 的文件信息（不是数组）

    fs.rename(req.file.path, "uploads/" + req.file.originalname, function(err) {
        if (err) {
            throw err;
        }
        console.log('上传成功!');
    })
    /*res.writeHead(200, {
        "Access-Control-Allow-Origin": "*"
    });*/
    res.end(JSON.stringify(req.file) + JSON.stringify(req.body));
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json({limit:'50mb'}));//limit: Controls the maximum request body size.
app.use(express.urlencoded({limit: '50mb', extended: true}));

app.use(upload.array());// multipart/form-data 中间件支持

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/server', loginControl);
app.use('/user', userControl);
app.use('/todo', todoControl);
app.use('/public',publicControl);
app.use('/uploads',express.static('uploads'));//将文件设置成静态

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


module.exports = { app, server };