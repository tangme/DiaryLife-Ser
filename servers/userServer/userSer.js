const mysql = reqlib('/database/mysqlDriver');

const UPDATE_USERINFO = `update user t set t.account = ?, t.nickname = ?, t.phone = ?, t.email = ? where t.tid =? `;

module.exports = {
	/*更新用户资料信息*/
	updateUserInfo:function(tid,{account,nickName,phone,email}){
		if(!nickName){
			return new Promise(function(resolve,reject){
				resolve({'code':0,'msg':'昵称不能为空'});
			});
		}
		if(!phone){
			return new Promise(function(resolve,reject){
				resolve({'code':0,'msg':'联系电话不能为空'});
			});
		}
		let sqlParams = [account,nickName,phone,email,tid];
		return mysql.exe(UPDATE_USERINFO,sqlParams).then(function(data){
			if(data.fieldCount == 0){
				return {'code':1,'msg':'操作成功'};
			}else{
				return {'code':0,'msg':'操作失败'};
			}
	    });
	}
};