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
	let aWss = expressWs.getWss('/notification');
	
	if(typeof userInfo != 'undefined'){
		userSer.updateUserInfo(userInfo.tid,tmpBody.nickName).then(data=>{
    		res.json(data);
    		/*aWss.clients.forEach(function (client) {
    			console.log(client);
			    client.send('hello-lalal');
			});*/
			WS_MAP.get('tanglv').send('from map lalala.');
		})
	}
});

module.exports = router;