const mysql = reqlib('/database/mysqlDriver');
const uuidv1 = require('uuid/v1');
const QUERY_TODO_SQL = `select tid,content from todo t where t.account_id = ? and t.finished_time is null order by t.create_time `;
const QUERY_FINISHED_TODO_SQL = `select tid,content from todo t where t.account_id = ? and t.finished_time is not null order by t.create_time `;
const ADD_TODO_SQL = `insert into todo(tid,content,account_id,create_time) values(?,?,?,?)`;
const UPDATE_TODO_SQL = `update todo t set t.content = ? where t.tid = ? `;
const FINISHED_TODO_SQL = `update todo t set t.finished_time = ? where t.tid = ? `;
const UNDO_TODO_SQL = `update todo t set t.finished_time = null where t.tid = ? `;
const DELETE_TODO_SQL = `delete from todo where tid = ?`;

module.exports = {
	/**
	 * [queryTodo 查询待办]
	 * @author tanglv 2018-08-13
	 * @param  {[type]} account_id      [帐号id]
	 */
	queryTodo:function(account_id){
		if(!account_id){
			return new Promise(function(resolve,reject){
				resolve({'code':0,'msg':'查询帐号不能为空'});
			});
		}
		let sqlParams = [account_id];
		return mysql.exe(QUERY_TODO_SQL,sqlParams).then(function(data){
			return data;
	    });
	},
	/**
	 * [queryFinishedTodo 查询已完成的待办]
	 * @Author tanglv   2019-05-24
	 * @param  {[type]} account_id [description]
	 * @return {[type]}            [description]
	 */
	queryFinishedTodo:function(account_id){
		if(!account_id){
			return new Promise(function(resolve,reject){
				resolve({ 'code': 0, 'msg':'查询帐号不能为空'});
			});
		}
		let sqlParams = [account_id];
		return mysql.exe(QUERY_FINISHED_TODO_SQL, sqlParams).then(function (data) {
			return data;
		});
	},
	/**
	 * [addTodo 增加待办]
	 * @author tanglv 2018-08-13
	 * @param  {[type]} content [description]
	 * @param  {[type]} account_id [description]
	 */
	addTodo:function(content,account_id){
		if(!content || !account_id){
			return new Promise(function(resolve,reject){
				resolve({'code':0,'msg':'必备字段不能为空'});
			});
		}
		let tid = uuidv1();
		let sqlParams = [tid,content,account_id,+new Date()];
		return mysql.exe(ADD_TODO_SQL,sqlParams).then(data=>{
			return {'code':1,'msg':'注册成功','data':{'tid':tid}};
		},data=>{
			return {'code':0,'msg':'注册失败'};
		});
	},
	/**
	 * [updateTodo 修改待办]
	 * @author tanglv 2018-08-13
	 * @param  {[type]} tid      [记录id]
	 * @param  {[type]} nickName [description]
	 */
	updateTodo:function(tid,content){
		if(!tid || !content){
			return new Promise(function(resolve,reject){
				resolve({'code':0,'msg':'必备字段不能为空'});
			});
		}
		let sqlParams = [content,tid];
		return mysql.exe(UPDATE_TODO_SQL,sqlParams).then(data=>{
			return {'code':1,'msg':'注册成功'};
		},data=>{
			return {'code':0,'msg':'注册失败'};
		});
	},
	/**
	 * [finishedTodo 将待办更新为完成状态]
	 * @Author tanglv   2019-05-24
	 * @param  {[type]} tid        [description]
	 * @return {[type]}            [description]
	 */
	finishedTodo:function(tid){
		if(!tid){
			return new Promise(function(resolve,reject){
				resolve({'code':0,'msg':'必备字段不能为空'});
			});
		}
		let sqlParams = [+new Date(),tid];
		return mysql.exe(FINISHED_TODO_SQL,sqlParams).then(data=>{
			return {'code':1,'msg':'更新操作成功'};
		},data=>{
			return {'code':0,'msg':'更新操作失败'};
		});
	},
	/**
	 * [undoTodo 将待办更新为 未完成状态]
	 * @Author tanglv   2019-05-24
	 * @param  {[type]} tid        [description]
	 * @return {[type]}            [description]
	 */
	undoTodo:function(tid){
		if(!tid){
			return new Promise(function(resolve,reject){
				resolve({'code':0,'msg':'必备字段不能为空'});
			});
		}
		let sqlParams = [tid];
		return mysql.exe(UNDO_TODO_SQL,sqlParams).then(data=>{
			return {'code':1,'msg':'更新操作成功'};
		},data=>{
			return {'code':0,'msg':'更新操作失败'};
		});
	},
	/**
	 * [deleteTodo 删除待办]
	 * @author tanglv 2018-08-13
	 * @param  {[type]} tid      [记录id]
	 */
	deleteTodo:function(tid){
		if(!tid){
			return new Promise(function(resolve,reject){
				resolve({'code':0,'msg':'tid'});
			});
		}
		let sqlParams = [tid];
		return mysql.exe(DELETE_TODO_SQL,sqlParams).then(data=>{
			return {'code':1,'msg':'注册成功'};
		},data=>{
			return {'code':0,'msg':'注册失败'};
		});
	}
};