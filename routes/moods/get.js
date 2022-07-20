const express = require('express');
const Mood = require("../../src/models/moods");
const router = express.Router();
router.use(express.json())
router.post('/', async function(req, res, next) {
  const payload = req.body;
  try {
    const u = new Mood();
    const mood = await u.find(payload);
    res.json(mood);
  } catch (error) {
    res.json(error);
  }
});
module.exports = router;
