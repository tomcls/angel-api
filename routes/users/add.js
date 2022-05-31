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
      phone: payload.phone,
      sex: payload.sex,
      type: payload.type,
      address: payload.address,
      street_number: payload.street_number,
      zip: payload.zip,
      city: payload.city,
      country: country,
      lang: payload.lang,
      birthday: payload.birthday,
      role: payload.role,
      password: payload.password?CryptoJS.MD5(JSON.stringify(payload.password)).toString():CryptoJS.MD5(JSON.stringify('Password must be changed')).toString(),
      active: payload.active?payload.active:'N'
    }
    const u = new User();
    const user = await u.add(o);
    console.log('user',user)
    return res.json(user);
  } catch (error) {
    console.log('error',error)
    return res.json(error);
  }
});
module.exports = router;
