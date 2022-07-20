const express = require('express');
const async = require('async');
const Survey = require("../../src/models/surveys");
const router = express.Router();
router.use(express.json())
router.post('/',  function(req, res, next) {
  const payload = req.body;
  try {
    const u = new Survey();
    
    async.parallel([
      function(callback) {
        u.moods(payload).then(function(r){
          callback(null, r);
        }).catch(function(error){
          callback(error);
        });
      },
      function(callback) {
        u.groupMoods(payload).then(function(r){
          callback(null, r);
        }).catch(function(error){
          callback(error);
        });
      },
      function(callback) {
        u.groupDates(payload).then(function(r){
          callback(null, r);
        }).catch(function(error){
          callback(error);
        });
      },
      function(callback) {
        u.groupPatients(payload).then(function(r){
          callback(null, r);
        }).catch(function(error){
          callback(error);
        });
      }
    ],  function(err, results) {
      return res.json({
        surveys : results[0],
        moods: results[1],
        dates: results[2],
        patients: results[3]
      });
    });
  } catch (error) {
    return res.json(error);
  }
});
module.exports = router;
