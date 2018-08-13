const express = require('express');
const router = express.Router();

const mysql = reqlib('/database/mysqlDriver');
const loginSer = reqlib('/servers/loginServer/loginSer');
const SESSION_STORE = reqlib('/SESSION_STORE');


/**
 * [用户注册]
 * @author tanglv 2018-08-08
 */
router.post('/register', function(req, res, next) {
    let tmpData = req.body;
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

/**
 * [用户登录]
 * @author tanglv 2018-08-08
 */
router.post('/login', function(req, res, next) {
	let tmpBody = req.body;
    loginSer.validAccountAndPwd(tmpBody.account,tmpBody.pwd).then(data=>{
        let {sendData,sessionStoreData} = data;
        !!sessionStoreData && (SESSION_STORE[req.sessionID] = sessionStoreData);
        res.json(sendData);
    });
});

/**
 * [用户退出]
 * @author tanglv 2018-08-08
 */
router.post('/logout', function(req, res, next) {
    let userInfo = SESSION_STORE[req.sessionID]; 
    if(!!userInfo){ 
        let account = userInfo.account||userInfo.email||userInfo.phone;
        WS_MAP.get(account).close();
        WS_MAP.delete(account);
    }
    delete SESSION_STORE[req.sessionID];
    res.end();
});

module.exports = router;