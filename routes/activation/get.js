const express = require('express');
const Activation = require('../../src/models/activation');
const router = express.Router();
router.use(express.json())
router.post('/', async function(req, res, next) {
  const payload = req.body;
  try {
    const a = new Activation();
    const activation= await a.find(payload);
    res.json(activation);
  } catch (error) {
    console.log(error)
    res.json(error);
  }
});
module.exports = router;
