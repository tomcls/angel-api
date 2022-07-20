const express = require('express');
const Treatment = require("../../src/models/treatments");
const router = express.Router();
router.use(express.json())
router.post('/', async function(req, res, next) {
  const payload = req.body;
  try {
    const u = new Treatment();
    const m = await u.delete(payload);
    res.json(m);
  } catch (error) {
    res.json(error);
  }
});
module.exports = router;
