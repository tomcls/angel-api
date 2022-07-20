const express = require('express');
const SideEffect = require("../../src/models/sideEffects");
const router = express.Router();
router.use(express.json())
router.post('/', async function(req, res, next) {
  const payload = req.body;
  try {
    const u = new SideEffect();
    const m = await u.delete(payload);
    res.json(m);
  } catch (error) {
    res.json(error);
  }
});
module.exports = router;
