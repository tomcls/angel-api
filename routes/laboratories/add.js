const express = require('express');
const Laboratory = require("../../src/models/laboratories");
const router = express.Router();
router.use(express.json())
router.post('/', async function(req, res, next) {
  const payload = req.body;
  try {
    const u = new Laboratory();
    const laboratory = await u.add(payload);
    return res.json(laboratory);
  } catch (error) {
    console.log('error',error)
    return res.json(error);
  }
});
module.exports = router;
