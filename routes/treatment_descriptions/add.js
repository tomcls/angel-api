const express = require('express');
const TreatmentDescription = require('../../src/models/treatmentDescriptions');
const router = express.Router();
router.use(express.json())
router.post('/', async function(req, res, next) {
  const payload = req.body;
  try {
    const u = new TreatmentDescription();
    const treatment = await u.add(payload);
    return res.json(treatment);
  } catch (error) {
    return res.json(error);
  }
});
module.exports = router;
