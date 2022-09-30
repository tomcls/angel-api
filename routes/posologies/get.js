const express = require('express');
const Posology = require("../../src/models/posologies");
const router = express.Router();
router.use(express.json())
router.post('/', async function(req, res, next) {
  const payload = req.body;
  try {
    const p = new Posology();
    const pos = await p.find(payload);
    res.json(pos);
  } catch (error) {
    console.log(error)
    res.json(error);
  }
});
module.exports = router;
