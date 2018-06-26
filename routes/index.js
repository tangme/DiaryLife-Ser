var express = require('express');
var router = express.Router();

/*var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'rm-bp11zadzrqg96iqj9.mysql.rds.aliyuncs.com',
  user     : 'ceshi',
  password : 'Ceshi20180205'
});*/



/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/', function(req, res, next) {
	console.log("req.params",req.params);
	console.log("req.body",req.body);
	console.log("hot run");
	
	/*connection.connect();
	connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
	  if (err) throw err;
	  console.log('The solution is: ', rows[0].solution);
	});
	connection.end();*/

    res.json({ user: 'tobi' })
});

/*用户注册*/
router.post('/register',function(req, res, next){
	console.log('req.headers:',req.headers.tanglv);
	if(!!req.headers.tanglv && req.headers.tanglv == 'zhoudan'){
		res.json({msg:'ok.'});
	}else{
		res.status(403).json({ error: 'message' });
	}
	/*console.log("req.body",req.body);*/
});

module.exports = router;