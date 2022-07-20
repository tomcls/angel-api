const express = require('express');
const Drug = require("../../src/models/drugs");
const router = express.Router();
router.use(express.json())
router.post('/', async function(req, res, next) {
  const payload = req.body;
  try {
    const u = new Drug();
    const drug = await u.update(payload);
    return res.json(drug);
  } catch (error) {
    return res.json(error);
  }
});
module.exports = router;
