const express = require('express');
const router = express.Router();

/*用户注册*/
router.post('/register',function(req, res, next){
	console.log('======== in login.');
	console.log('req.headers:',req.headers.tanglv);
	if(!!req.headers.tanglv && req.headers.tanglv == 'zhoudan'){
		res.json({msg:'ok.'});
	}else{
		res.status(403).json({ error: 'message' });
	}
	/*console.log("req.body",req.body);*/
});

/*用户登录*/
router.post('/login',function(req, res, next){
	res.json({'msg':'in login methods'});
	return;
	if(!!req.headers.tanglv && req.headers.tanglv == 'zhoudan'){
		res.json({msg:'ok.'});
	}else{
		res.status(403).json({ error: 'message' });
	}
});

/*用户退出*/
router.post('/logout',function(req, res, next){
	res.json({'msg':'in logout methods'});
	return;
	if(!!req.headers.tanglv && req.headers.tanglv == 'zhoudan'){
		res.json({msg:'ok.'});
	}else{
		res.status(403).json({ error: 'message' });
	}
});

module.exports = router;