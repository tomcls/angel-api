const express = require('express');
const SurveyEffectDescriptions = require('../../src/models/surveyEffectDescriptions');
const router = express.Router();
router.use(express.json())
router.post('/', async function(req, res, next) {
  const payload = req.body;
  try {
    const u = new SurveyEffectDescriptions();
    const sideEffect = await u.add(payload);
    return res.json(sideEffect);
  } catch (error) {
    return res.json(error);
  }
});
module.exports = router;
