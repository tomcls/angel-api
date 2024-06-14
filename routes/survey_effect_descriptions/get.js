const express = require('express');
const SurveyEffectDescriptions = require('../../src/models/surveyEffectDescriptions');
const router = express.Router();
router.use(express.json())
router.post('/', async function(req, res, next) {
  const payload = req.body;
  try {
    const u = new SurveyEffectDescriptions();
    const sideEffect = await u.get(payload);
    res.json(sideEffect);
  } catch (error) {
    res.json(error);
  }
});
module.exports = router;
