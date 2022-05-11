const express = require('express');
const User = require("../../src/models/users");
const router = express.Router();
router.use(express.json())
router.post('/', async function(req, res, next) {
  const payload = req.body;
  try {
    const u = new User();
    const user = await u.find(payload);
    res.json(user);
  } catch (error) {
    console.log(error)
    res.json(error);
  }
});
module.exports = router;
