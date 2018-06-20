var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/', function(req, res, next) {
	console.log("req.params",req.params);
	console.log("req.body",req.body);
	console.log("hot run");
    res.json({ user: 'tobi' })
});

module.exports = router;