const express = require('express');
const jwt = require("jsonwebtoken")
const CryptoJS = require("crypto-js");
const User = require("../../src/models/users");
const router = express.Router();
router.use(express.json())
router.get('/', async function(req, res, next) {
  
  const token = req.headers["authorization"]
console.log('whhhahahaah',token)
  //the request header contains the token "Bearer <token>", split the string and use the second value in the split array.
  if (token == null) res.status(400).json({error:"Authorization not present"})
  jwt.verify(token, process.env.API_SECRET, (err, user) => {
      if (err) {
          res.status(403).json({error:"Authorization not valid"});
      }
      else {
          res.json(user);
      }
  })
});
module.exports = router;
