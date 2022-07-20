const express = require('express');
const Treatment = require("../../src/models/treatments");
const router = express.Router();
router.use(express.json())
router.post('/', async function(req, res, next) {
  const payload = req.body;
  try {
    const u = new Treatment();
    const t = await u.addDrug(payload);
    return res.json(t);
  } catch (error) {
    console.log('error',error)
    return res.json(error);
  }
});
module.exports = router;
