const mysql = reqlib('/database/mysqlDriver');

const UPDATE_USERINFO = `update user t set t.nickname = ? where t.tid =? `;

module.exports = {
	/*更新用户资料信息*/
	updateUserInfo:function(tid,nickName){
		if(!nickName){
			return new Promise(function(resolve,reject){
				resolve({'code':0,'msg':'昵称不能为空'});
			});
		}
		let sqlParams = [nickName,tid];
		return mysql.exe(UPDATE_USERINFO,sqlParams).then(function(data){
			console.log("||||||||||||||||||||||");
			console.log(data);
	        if(!!data && data.length==1){
	            return {'code':1,'msg':'操作成功'};
	        }else{
	            return {'code':0,'msg':'操作失败'};
	        }
	    });
	}
};