const express = require('express');
const Hospital = require("../../src/models/hospitals");
const router = express.Router();
router.use(express.json())
router.post('/', async function(req, res, next) {
  const payload = req.body;
  try {
    const u = new Hospital();
    const h = await u.delete(payload);
    res.json(h);
  } catch (error) {
    res.json(error);
  }
});
module.exports = router;
