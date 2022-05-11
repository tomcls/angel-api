const express = require('express');
const User = require("../../src/models/users");
const CryptoJS = require("crypto-js");
const router = express.Router();
router.use(express.json())
router.post('/', async function(req, res, next) {
  const payload = req.body;
  try {
    console.log('payload',payload)
    let o = {
      firstname: payload.firstname,
      lastname: payload.lastname,
      email: payload.email,
      type: payload.type,
      role: payload.role,
      password: CryptoJS.MD5(JSON.stringify(payload.password)).toString(),
      active: false
    }
    const u = new User();
    const user = await u.add(o);
    console.log('user',user)
    res.json(user);
  } catch (error) {
    console.log('error',error)
    res.json(error);
  }
});
module.exports = router;
