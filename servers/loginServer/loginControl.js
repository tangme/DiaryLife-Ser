const express = require('express');
const router = express.Router();

const mysql = reqlib('/database/mysqlDriver');
const loginSer = reqlib('/servers/loginServer/loginSer');
const SESSION_STORE = reqlib('/SESSION_STORE');


/*用户注册*/
router.post('/register', function(req, res, next) {
    let tmpData = req.body.data;
    if(!tmpData.email || !tmpData.phone || !tmpData.pwd){
    	res.json({'msg':'电子邮箱、电话号码、密码均不能为空'});
    	return;
    }
    loginSer.validRegister(tmpData.email,tmpData.phone,tmpData.pwd)
    .then(data=>{
        if(data.code==0){
            res.json(data);
        }else{
            loginSer.doRegister(tmpData.email,tmpData.phone,tmpData.pwd).then(data=>{
                res.json(data);
            });
        }
    });
});

/*用户登录*/
router.post('/login', function(req, res, next) {
	let tmpBody = req.body;
    loginSer.validAccountAndPwd(tmpBody.account,tmpBody.pwd).then(data=>{
        console.log("------------------------");
        console.log(data);
        console.log("------------------------");
        SESSION_STORE[req.sessionID] = data.userObj;
        res.json(data);
    });
});

/*用户退出*/
router.post('/logout', function(req, res, next) {
    res.json({ 'msg': 'in logout methods' });
    return;
    if (!!req.headers.tanglv && req.headers.tanglv == 'zhoudan') {
        res.json({ msg: 'ok.' });
    } else {
        res.status(403).json({ error: 'message' });
    }
});

module.exports = router;