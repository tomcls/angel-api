const express = require('express');
const Survey = require("../../src/models/sideEffects");
const router = express.Router();
router.use(express.json())
router.post('/', async function(req, res, next) {
  const payload = req.body;
  try {
    const u = new Survey();
    const sideEffects = await u.search(payload);
    res.json(sideEffects);
  } catch (error) {
    res.json(error);
  }
});
module.exports = router;
