const express = require('express');
const router = express.Router();

const mysql = reqlib('/database/mysqlDriver');

/**
 * [更新用户信息]
 * @author tanglv 2018-07-13
 */
router.post('/updateUserInfo', function(req, res, next) {
    let tmpData = req.body.data;
    console.log(tmpData.account,tmpData.nickName);
    if(!tmpData.account){
    	res.json({'msg':'帐号信息不能为空'});
    	return;
    }
});

module.exports = router;