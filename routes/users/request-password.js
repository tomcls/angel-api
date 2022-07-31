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
        active:1
    }
    const user = await u.find(payload);
    if(user && user.active) {
        const requestEmail = await u.requestPassword(o.email);
        if(requestEmail && requestEmail.length && (requestEmail[0].statusCode ==202 || requestEmail[0].statusCode==200 )) {
            res.json({result: 'success',msg: requestEmail});
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
