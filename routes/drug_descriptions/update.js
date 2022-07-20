const express = require('express');
const DrugDescription = require('../../src/models/drugDescriptions');
const router = express.Router();
router.use(express.json())
router.post('/', async function(req, res, next) {
  const payload = req.body;
  try {
    const u = new DrugDescription();
    const drug = await u.update(payload);
    return res.json(drug);
  } catch (error) {
    return res.json(error);
  }
});
module.exports = router;
