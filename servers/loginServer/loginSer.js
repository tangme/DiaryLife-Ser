const mysql = reqlib('/database/mysqlDriver');
const uuidv1 = require('uuid/v1');

/*查询登录信息*/
const queryUserSql = `SELECT account,email,phone,tid,nickname from user t where (t.account=? or t.email=? or t.phone=?) and t.pwd=?`;
/*查询电子邮箱、手机号是否已经存在*/
const checkAccountExistedSql = `SELECT
				( CASE WHEN t.email = ? THEN 1 ELSE 0 END ) email,
				( CASE WHEN t.phone = ? THEN 1 ELSE 0 END ) phone 
			FROM
				USER t 
			WHERE
				t.email = ? 
				OR t.phone = ? `;
/*注册sql*/				
const insertAccountSql = `insert into user(email,phone,pwd,tid) values(?,?,?,?)`;				

module.exports = {
	/*验证 帐号与密码 有效性*/
	validAccountAndPwd:function(account,pwd){
		if(!account || !pwd){
			return new Promise(function(resolve,reject){
				resolve({'code':0,'msg':'账号与密码不能为空'});
			});
		}
		let sqlParams = [account,account,account,pwd];
		return mysql.exe(queryUserSql,sqlParams).then(function(data){
			let sendData = null,sessionStoreData = null;
	        if(!!data && data.length==1){
	        	let sendTmpData = JSON.parse(JSON.stringify(data[0]));//深拷贝数据
	        	delete sendTmpData.tid;//返回给客户端的数据，剔除tid属性
	        	sendData = {'code':1,'msg':'登录成功','userObj':sendTmpData};
	        	sessionStoreData = data[0];
	            return {sendData,sessionStoreData};
	        }else{
	            sendData = {'code':0,'msg':'帐号或密码错误'};
	            return {sendData,sessionStoreData};
	        }
	    });
	},
	/*验证 新用户注册信息*/
	validRegister:function(email,phone,pwd){
		if(!email || !phone || !pwd){
			return new Promise(function(resolve,reject){
				resolve({'code':0,'msg':'电子邮箱、电话号码啊、密码均不能为空'});
			});
		}
		let sqlParams = [email,phone,email,phone];
		return mysql.exe(checkAccountExistedSql,sqlParams).then(data=>{
			if(!!data && data.length>0){
				let msg = data[0].email==1?' 电子邮箱':'';
				msg += data[0].phone==1?' 电话号码':'';
				msg += '，已被注册使用。'
	            return {'code':0,'msg':msg};
	        }else{
	        	return {'code':1};
	        }
		});
	},
	/*进行注册操作*/
	doRegister:function(email,phone,pwd){
		let sqlParams = [email,phone,pwd,uuidv1()];
		return mysql.exe(insertAccountSql,sqlParams).then(data=>{
			return {'code':1,'msg':'注册成功'};
		},data=>{
			return {'code':0,'msg':'注册失败'};
		});
	}
};