const express = require('express');
const User = require("../../src/models/users");
const Activation = require('../../src/models/activation');
const router = express.Router();
router.use(express.json())
router.post('/', async function(req, res, next) {
  const payload = req.body;
  try {
    
    const u = new User();
    const user = await u.update({id:payload.user_id,active:'Y'});
    const a = new Activation();
    a.delete({user_id:payload.user_id})
    return res.json(user);
  } catch (error) {
    return res.json(error);
  }
});
module.exports = router;
