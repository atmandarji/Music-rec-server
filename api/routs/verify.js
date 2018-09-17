const express = require('express');
const router = express.Router();
const verifytoken = require('../middleware/verifytoken');

router.get('/', verifytoken, (req, res, next)=>{
  console.log(req.headers.uid);
  res.status(200).json({
    message: "Session running"
  });
})

module.exports = router;
