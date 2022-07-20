const express = require('express');
const Drug = require("../../src/models/drugs");
const router = express.Router();
router.use(express.json())
router.post('/', async function(req, res, next) {
  const payload = req.body;
  try {
    const u = new Drug();
    const drugs = await u.delete(payload);
    res.json(drugs);
  } catch (error) {
    res.json(error);
  }
});
module.exports = router;
