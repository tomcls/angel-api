const express = require('express');
const async = require('async');
const Survey = require("../../src/models/surveys");
const router = express.Router();
router.use(express.json())
router.post('/',  function(req, res, next) {
  const payload = req.body;
  try {
    const u = new Survey();
    
    u.groupSideEffectDates(payload).then(function(r){
      return res.json(r);
    });

  } catch (error) {
    return res.json(error);
  }
});
module.exports = router;
