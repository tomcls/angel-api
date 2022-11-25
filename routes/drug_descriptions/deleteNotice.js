const express = require('express');
const DrugDescription = require('../../src/models/drugDescriptions');
const router = express.Router();
router.use(express.json())
router.post('/', async function(req, res, next) {
  const payload = req.body;
  try {
    console.log(payload)
    const u = new DrugDescription();
    await u.deleteNotice(payload);
    res.json(" notice well deleted");
  } catch (error) {
    return res.json(error);
  }
});
module.exports = router;
