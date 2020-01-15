const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require("fs"); //操作文件

router.post('/jsonbase64', function(req, res, next) {
    let tmpBody = req.body;
    let {image} = tmpBody;
    let datas = image.split(',');
    let t = path.join(__dirname, '../../uploads/image.jpg')
    fs.writeFile(t, datas[1],'base64', function(err) {
        if(err){
          res.send(err);
        }else{
          res.send({'success':'1'});
        }

    });
});


module.exports = router;