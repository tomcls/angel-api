const express = require('express');
const Nurse = require("../../src/models/nurses");
const router = express.Router();
router.use(express.json())
router.post('/', async function(req, res, next) {
  const payload = req.body;
  try {
    const u = new Nurse();
    const nurse = await u.update(payload);
    return res.json(nurse);
  } catch (error) {
    console.log('error',error)
    return res.json(error);
  }
});
module.exports = router;
