const express = require('express');
const SideEffect = require("../../src/models/sideEffects");
const router = express.Router();
router.use(express.json())
router.post('/', async function(req, res, next) {
  const payload = req.body;
  try {
    const u = new SideEffect();
    const sideEffect = await u.update(payload);
    return res.json(sideEffect);
  } catch (error) {
    return res.json(error);
  }
});
module.exports = router;
