const express = require('express');
const Hospital = require("../../src/models/hospitals");
const router = express.Router();
router.use(express.json())
router.post('/', async function(req, res, next) {
  const payload = req.body;
  try {
    console.log('payload',payload)
    
    const u = new Hospital();
    const hospital = await u.add(payload);
    return res.json(hospital);
  } catch (error) {
    console.log('error',error)
    return res.json(error);
  }
});
module.exports = router;
