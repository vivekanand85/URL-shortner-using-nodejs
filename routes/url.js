const express=require('express');
const { handleShortUrl, handleAnalitcs } = require('../controller/url');
const router=express.Router();

router.post('/',handleShortUrl);
router.get('/analytics/:shortId',handleAnalitcs)

module.exports=router;