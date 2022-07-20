const express = require('express');
const Scientist = require("../../src/models/scientists");
const CryptoJS = require("crypto-js");
const router = express.Router();
router.use(express.json())
router.post('/', async function(req, res, next) {
  const payload = req.body;
  try {
    const u = new Scientist();
    const scientist = await u.addPatient(payload);
    return res.json(scientist);
  } catch (error) {
    console.log('error',error)
    return res.json(error);
  }
});
module.exports = router;
