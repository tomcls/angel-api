const express = require('express');
const SideEffectDescription = require('../../src/models/sideEffectDescriptions');
const router = express.Router();
router.use(express.json())
router.post('/', async function(req, res, next) {
  const payload = req.body;
  try {
    const u = new SideEffectDescription();
    const sideEffect = await u.add(payload);
    return res.json(sideEffect);
  } catch (error) {
    return res.json(error);
  }
});
module.exports = router;
