const express = require('express');
const DrugDescription = require('../../src/models/drugDescriptions');
const router = express.Router();
router.use(express.json())
router.post('/',  function(req, res, next) {
  const payload = req.body;
  try {
    const u = new DrugDescription();
    u.add(payload, function(ids){
      return res.json(ids);
    });
    
  } catch (error) {
    return res.json(error);
  }
});
module.exports = router;
