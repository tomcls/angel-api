const express = require('express');
const async = require('async');
const Drug = require("../../src/models/drugs");
const router = express.Router();
router.use(express.json())
router.post('/',  function(req, res, next) {
  const payload = req.body;
  try {
    const u = new Drug();
    
    async.parallel([
      function(callback) {
        u.getUserDrugs(payload).then(function(r){
          callback(null, r);
        }).catch(function(error){
          callback(error);
        });
      },
      function(callback) {
        u.countUserDrugs(payload).then(function(r){
          callback(null, r);
        }).catch(function(error){
          callback(error);
        });
      }
    ],  function(err, results) {
      const treatments = results[0];
      return res.json({
        treatments : treatments,
        total: results[1]
      });
    });
  } catch (error) {
    return res.json(error);
  }
});
module.exports = router;
