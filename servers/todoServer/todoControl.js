const express = require('express');
const router = express.Router();
const mysql = reqlib('/database/mysqlDriver');
const SESSION_STORE = reqlib('/SESSION_STORE');

const todoSer = reqlib('/servers/todoServer/todoSer');

/**
 * [查询待办]
 * @author tanglv 2018-08-13
 */
router.post('/queryTodo', function(req, res, next) {
	let tmpBody = req.body;
	let userInfo = SESSION_STORE[req.sessionID];
	
	if(typeof userInfo != 'undefined'){
		todoSer.queryTodo(userInfo.tid).then(data=>{
    		res.json(data);
		})
	}
});
router.post('/queryFinishedTodo', function (req, res, next) {
	let tmpBody = req.body;
	let userInfo = SESSION_STORE[req.sessionID];

	if (typeof userInfo != 'undefined') {
		todoSer.queryFinishedTodo(userInfo.tid).then(data => {
			res.json(data);
		})
	}
});
/**
 * [增加待办]
 * @author tanglv 2018-08-13
 */
router.post('/addTodo', function(req, res, next) {
	let tmpBody = req.body;
	let userInfo = SESSION_STORE[req.sessionID];
	
	if(typeof userInfo != 'undefined'){
		todoSer.addTodo(tmpBody.content,userInfo.tid).then(data=>{
    		res.json(data);
		})
	}
});

/**
 * [修改待办]
 * @author tanglv 2018-08-13
 */
router.post('/updateTodo', function(req, res, next) {
	let tmpBody = req.body;
	let userInfo = SESSION_STORE[req.sessionID];
	
	if(typeof userInfo != 'undefined'){
		todoSer.updateTodo(tmpBody.tid,tmpBody.content).then(data=>{
    		res.json(data);
		})
	}
});

router.post('/finishedTodo', function(req, res, next) {
	let tmpBody = req.body;
	let userInfo = SESSION_STORE[req.sessionID];
	
	if(typeof userInfo != 'undefined'){
		todoSer.finishedTodo(tmpBody.tid).then(data=>{
    		res.json(data);
		})
	}
});

/**
 * [删除待办]
 * @author tanglv 2018-08-13
 */
router.post('/deleteTodo', function(req, res, next) {
	let tmpBody = req.body;
	let userInfo = SESSION_STORE[req.sessionID];
	
	if(typeof userInfo != 'undefined'){
		todoSer.deleteTodo(tmpBody.tid).then(data=>{
    		res.json(data);
		})
	}
});
module.exports = router;