const express = require('express');
const Mood = require("../../src/models/moods");
const router = express.Router();
router.use(express.json())
router.post('/', async function(req, res, next) {
  const payload = req.body;
  try {
    const u = new Mood();
    const mood = await u.update(payload);
    return res.json(mood);
  } catch (error) {
    return res.json(error);
  }
});
module.exports = router;
