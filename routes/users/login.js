const express = require('express');
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken")
const User = require("../../src/models/users");
const router = express.Router();
router.use(express.json())
router.post('/', async function (req, res, next) {
  const apiKey = req.headers["apikey"];
  if (apiKey == null) {
    return res.status(400).json({ error: 'apikey not present' });
  }
  const payload = req.body;
  try {
    const u = new User();
    const user = await u.find(payload);
    if (user && user.active) {
      if (user && user.password && user.password === CryptoJS.MD5(JSON.stringify(payload.password)).toString()) {
        const o = {
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          type: user.type,
          date_created: user.date_created,
          avatar: user.avatar
        }
        const token = jwt.sign(o, process.env.API_SECRET, { expiresIn: "3600m" })
        return  res.json({user:user, accessToken: token});
      } else {
        return  res.json({ error: 'password not correct' });
      }
    } else {
      return  res.json({ error: 'error user not found or not yet actif' });
    }
  } catch (error) {
    return res.json({ error: error });
  }
});
module.exports = router;
