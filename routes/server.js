const express = require('express');
const router = express.Router();

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'diarylife'
});
connection.connect();

/*用户注册*/
router.post('/register', function(req, res, next) {
    let tmpData = req.body.data;
    if(!tmpData.email || !tmpData.phone || !tmpData.pwd){
    	res.json({'msg':'电子邮箱、电话号码、密码均不能为空'});
    	return;
    }
    isRegistered(tmpData).then(function(flag){
    	if(flag){
    		console.log('已注册');
    		res.json({'msg':'已注册'});
    	}else{
    		console.log('未注册');
    		let sql = `insert into user(email,phone,pwd) 
    			values(?,?,?)`;
		    let sqlParams = [tmpData.email,tmpData.phone,tmpData.pwd];
		    connection.query(sql,sqlParams, function(err, rows, fields) {
		        if (err){
		        	res.json({'msg':'注册失败'});
		        	throw err;	
		        }else{
		        	res.json({'msg':'注册成功'});
		        }
		    });
    	}
    }).then(function(){
    	console.log("哇哦");
    })
    
});
/*注册信息是否已经注册*/
function isRegistered(data){
	return new Promise(function(resolve,reject){
		let sql = `SELECT * from user t where t.email=? or t.phone=? `;
	    let sqlParams = [data.email,data.phone];
	    connection.query(sql,sqlParams, function(err, rows, fields) {
	        if (err){
	        	reject();
	        	throw err;	
	        } 
	        if(!!rows && rows.length>0){
	        	resolve(true);
	        }else{
	        	resolve(false);
	        }
	    });
	});
	/*let sql = `SELECT * from user t where t.email=? or t.phone=? `;
    let sqlParams = [data.email,data.phone];
    connection.query(sql,sqlParams, function(err, rows, fields) {
        if (err) throw err;
        console.log(rows);
        if(!!rows && rows.length>0){
        	console.log('已经注册啦啦');
        	return true;
        }else{
        	return false;
        }
    });*/
}

/*用户登录*/
router.post('/login', function(req, res, next) {
	let tmpBody = req.body;
	if(!tmpBody.account || !tmpBody.pwd){
		res.json({'msg':'账号与密码不能为空'});
		return;
	}
	let querySql = `SELECT 1 as result from user t 
					where (t.account=? or t.email=? or t.phone=?) and t.pwd=?`;
	let querySqlParams = [tmpBody.account,tmpBody.account,tmpBody.account,tmpBody.pwd];
    connection.query(querySql,querySqlParams, function(err, rows, fields) {
        if (err) throw err;
        if(!!rows && rows.length==1 && rows[0].result == 1){
        	res.json({'msg':'正确'});
        }else{
        	res.json({'msg':'失败'});
        }
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