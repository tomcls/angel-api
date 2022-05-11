const express = require('express');
const CryptoJS = require("crypto-js");
const User = require("../../src/models/users");
const router = express.Router();
router.use(express.json())
router.post('/', async function(req, res, next) {
  
  const payload = req.body;
  if(!payload.email || !payload.password) {
    return res.status(400).json({error: 'Missing email or password'}); 
  }
  try {
    const u = new User();
    const user = await u.find(payload);
    if(user && user.active) {
        const updatedPassword = await u.updatePassword([CryptoJS.MD5(JSON.stringify(payload.password)).toString(), payload.email]);
        res.json({result: updatedPassword});
    } else {
        res.status(400).json({error: 'could not update the password'}); 
    }
    
  } catch (error) {
    res.json(error);
  }
});
module.exports = router;
