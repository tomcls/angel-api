const express = require('express');
const MoodDescription = require('../../src/models/moodDescriptions');
const router = express.Router();
router.use(express.json())
router.post('/', async function(req, res, next) {
  const payload = req.body;
  try {
    const u = new MoodDescription();
    const mood = await u.add(payload);
    return res.json(mood);
  } catch (error) {
    return res.json(error);
  }
});
module.exports = router;
