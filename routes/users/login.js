const express = require('express');
const CryptoJS = require("crypto-js");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const User = require("../../src/models/users");
const router = express.Router();
router.use(express.json())
router.post('/', async function (req, res, next) {
  const apiKey = req.headers["api_key"];
  if (apiKey == null) {
    res.status(400).json({ error: 'apikey not present' });
  }
  const payload = req.body;
  try {
    const u = new User();
    const user = await u.find(payload);
    if (user && user.active) {
      if (user && user.password && user.password === CryptoJS.MD5(JSON.stringify(payload.password)).toString()) {
        bcrypt.hash(apiKey, 10).then((hashedKey) => {
          const o = {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            type: user.type,
            date_created: user.date_created
          }
          const token = jwt.sign(o, process.env.API_SECRET, { expiresIn: "20m" })
          res.json({user:user, accessToken: token});
        });
      } else {
        res.json({ error: 'password not correct' });
      }
    } else {
      res.json({ error: 'error user not found or not yet actif' });
    }
  } catch (error) {
    res.json({ error: error });
  }
});
module.exports = router;
