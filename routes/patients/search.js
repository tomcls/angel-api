const express = require('express');
const Patient = require("../../src/models/patients");
const router = express.Router();
router.use(express.json())
router.post('/', async function(req, res, next) {
  const payload = req.body;
  try {
    const u = new Patient();
    const patients = await u.search(payload);
    res.json(patients);
  } catch (error) {
    res.json(error);
  }
});
module.exports = router;
