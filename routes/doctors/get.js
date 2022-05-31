const express = require('express');
const Doctor = require("../../src/models/doctors");
const router = express.Router();
router.use(express.json())
router.post('/', async function(req, res, next) {
  const payload = req.body;
  try {
    const u = new Doctor();
    const doctor = await u.find(payload);
    res.json(doctor);
  } catch (error) {
    console.log(error)
    res.json(error);
  }
});
module.exports = router;
