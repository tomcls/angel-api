const express = require('express');
const Patient = require("../../src/models/patients");
const CryptoJS = require("crypto-js");
const router = express.Router();
router.use(express.json())
router.post('/', async function(req, res, next) {
  const payload = req.body;
  try {
    
    const u = new Patient();
    const patient = await u.update(payload);
    console.log('patient',patient)
    return res.json(patient);
  } catch (error) {
    console.log('error',error)
    return res.json(error);
  }
});
module.exports = router;
