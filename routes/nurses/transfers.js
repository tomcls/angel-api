const express = require('express');
const Transfer = require("../../src/models/patientTransfers");
const router = express.Router();
router.use(express.json())
router.post('/', async function(req, res, next) {
  const payload = req.body;
  try {
    const u = new Transfer();
    const transfers = await u.findAll(payload);
    res.json(transfers);
  } catch (error) {
    console.log(error)
    res.json(error);
  }
});
module.exports = router;