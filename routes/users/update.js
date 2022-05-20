const express = require('express');
const User = require("../../src/models/users");
const CryptoJS = require("crypto-js");
const router = express.Router();
router.use(express.json())
router.post('/', async function(req, res, next) {
  const payload = req.body;
  try {
    
    const u = new User();
    const user = await u.update(payload);
    console.log('user',user)
    return res.json(user);
  } catch (error) {
    console.log('error',error)
    return res.json(error);
  }
});
module.exports = router;
