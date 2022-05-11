const express = require('express');
const CryptoJS = require("crypto-js");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const User = require("../../src/models/users");
const router = express.Router();
router.use(express.json())
router.post('/', async function (req, res, next) {
  const apiKey = req.headers["apikey"];
  console.log("aaaa",req.headers)
  if (apiKey == null) {
    console.log("bbbb")
    return res.status(400).json({ error: 'apikey not present' });
  }
  const payload = req.body;
  try {
    const u = new User();
    const user = await u.find(payload);
    console.log("user",user)
    if (user && user.active) {
      if (user && user.password && user.password === CryptoJS.MD5(JSON.stringify(payload.password)).toString()) {
        const o = {
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          type: user.type,
          date_created: user.date_created
        }
        const token = jwt.sign(o, process.env.API_SECRET, { expiresIn: "20m" })
        console.log("token",token)
        res.json({user:user, accessToken: token});
      } else {
        console.log("rrrrrrpassword not correct")
        res.json({ error: 'password not correct' });
      }
    } else {
      res.json({ error: 'error user not found or not yet actif' });
    }
  } catch (error) {
    console.log(error)
    res.json({ error: error });
  }
});
module.exports = router;
