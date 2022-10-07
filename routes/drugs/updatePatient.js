const express = require('express');
const Drug = require("../../src/models/drugs");
const router = express.Router();
router.use(express.json())
router.post('/', async function(req, res, next) {
  const payload = req.body;
  try {
    const u = new Drug();
    const t = await u.updatePatient(payload);
    return res.json(t);
  } catch (error) {
    console.log('error',error)
    return res.json(error);
  }
});
module.exports = router;
