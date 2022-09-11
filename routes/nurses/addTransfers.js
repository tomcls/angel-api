const express = require('express');
const Transfer = require("../../src/models/patientTransfers");
const router = express.Router();
router.use(express.json())
router.post('/', async function(req, res, next) {
  const payload = req.body;
  try {
    const u = new Transfer();
    const transfer = await u.add(payload);
    return res.json(transfer);
  } catch (error) {
    console.log('error',error)
    return res.json(error);
  }
});
module.exports = router;
