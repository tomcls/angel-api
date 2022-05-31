const express = require('express');
const Doctor = require("../../src/models/doctors");
const CryptoJS = require("crypto-js");
const router = express.Router();
router.use(express.json())
router.post('/', async function(req, res, next) {
  const payload = req.body;
  try {
    const u = new Doctor();
    const doctor = await u.update(payload);
    console.log('doctor',doctor)
    return res.json(doctor);
  } catch (error) {
    console.log('error',error)
    return res.json(error);
  }
});
module.exports = router;
