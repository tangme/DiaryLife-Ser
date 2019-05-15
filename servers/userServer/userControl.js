const express = require('express');
const router = express.Router();

const mysql = reqlib('/database/mysqlDriver');
const userSer = reqlib('/servers/userServer/userSer');
const SESSION_STORE = reqlib('/SESSION_STORE');

/**
 * [更新用户信息]
 * @author tanglv 2018-07-13
 */
router.post('/updateUserInfo', function(req, res, next) {
	let tmpBody = req.body;
	let userInfo = SESSION_STORE[req.sessionID];
	
	if(typeof userInfo != 'undefined'){
		userSer.updateUserInfo(userInfo.tid,tmpBody).then(data=>{
    		res.json(data);
			let account = userInfo.account||userInfo.email||userInfo.phone;
			WS_MAP.get(account).send(`infomation from ${account}`);
		})
	}
});

module.exports = router;