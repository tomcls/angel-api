const express = require('express');
const User = require("../../src/models/users");
const Activation = require('../../src/models/activation');
const router = express.Router();
router.use(express.json())
router.post('/', async function(req, res, next) {
  const payload = req.body;
  try {
    
    const a = new Activation();
    let code = await a.find({user_id:payload.user_id,code:payload.code})
    console.log("aaaa",code)
    return res.json(code);
  } catch (error) {
    return res.json(error);
  }
});
module.exports = router;
