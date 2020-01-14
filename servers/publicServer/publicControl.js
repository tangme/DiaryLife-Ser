const express = require('express');
const router = express.Router();

router.post('/test', function(req, res, next) {
    let tmpBody = req.body;
    console.log('---');
    res.json({'hello':'123'});
});


module.exports = router;