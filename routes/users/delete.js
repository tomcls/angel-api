const express = require('express');
const User = require("../../src/models/users");
const router = express.Router();
router.use(express.json())
router.post('/', async function(req, res, next) {
  const payload = req.body;
  try {
    const u = new User();
    const user = await u.delete(payload);
    res.json(user);
  } catch (error) {
    res.json(error);
  }
});
module.exports = router;
