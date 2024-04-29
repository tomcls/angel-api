const express = require('express');
const User = require("../../src/models/users");
const router = express.Router();
router.use(express.json())
router.post('/', async function(req, res, next) {
  const payload = req.body;
  if(!payload.email) {
    return res.status(400).json({error: 'Missing email'}); 
  }
  try {
    const u = new User();
    const o = {
        email: payload.email,
        active:'Y'
    }
    const user = await u.find(payload);
   
    if(user && user.id) {
        const user = await u.requestPassword(o.email);
        if(user && user.id ) {
            res.json({result: 'success',user: user});
        } else {
            res.json({error: 'Error sending email',error:requestEmail});
        }
    } else {
        res.json({error: 'error user not found or not yet actif'}); 
    }
  } catch (error) {
    res.json(error);
  }
});
module.exports = router;
