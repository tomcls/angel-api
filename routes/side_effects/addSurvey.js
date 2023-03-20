const express = require('express');
const SideEffect = require("../../src/models/sideEffects");
const router = express.Router();
router.use(express.json())
router.get('/', async function(req, res, next) {
  const payload = req.query;
  try {
    const u = new SideEffect();
    const s = await u.addSurvey(payload);
    return res.json(s);
  } catch (error) {
    return res.json(error);
  }
});
module.exports = router;
