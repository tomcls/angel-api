const express = require('express');
const async = require('async');
const SideEffect = require("../../src/models/sideEffects");
const router = express.Router();
router.use(express.json())
router.post('/',  function(req, res, next) {
  const payload = req.body;
  try {
    const u = new SideEffect();
    
    async.parallel([
      function(callback) {
        u.findAllByDrug(payload).then(function(r){
          callback(null, r);
        }).catch(function(error){
          callback(error);
        });
      },
      function(callback) {
        u.countByDrug(payload).then(function(r){
          callback(null, r);
        }).catch(function(error){
          callback(error);
        });
      }
    ],  function(err, results) {
      const sideEffects = results[0];
      return res.json({
        sideEffects : sideEffects,
        total: results[1]
      });
    });
  } catch (error) {
    return res.json(error);
  }
});
module.exports = router;
