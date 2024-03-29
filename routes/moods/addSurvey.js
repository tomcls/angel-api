const express = require('express');
const Mood = require("../../src/models/moods");
const router = express.Router();
router.use(express.json())
router.post('/', async function(req, res, next) {
  const payload = req.body;
  try {
    const u = new Mood();
    const m = await u.addSurvey(payload);
    return res.json(m);
  } catch (error) {
    return res.json(error);
  }
});
module.exports = router;
