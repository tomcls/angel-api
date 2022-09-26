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
        u.concatMoods(payload).then(function(r){
          callback(null, r);
        }).catch(function(error){
          callback(error);
        });
      },
      function(callback) {
        u.countGroupEffects(payload).then(function(r){
          callback(null, r);
        }).catch(function(error){
          callback(error);
        });
      }
    ],  function(err, results) {
      return res.json({
        surveys : results[0],
        count: results[0]?results[0].length:0,
        effects: results[1]?results[1]:null,
      });
    });
  } catch (error) {
    return res.json(error);
  }
});
module.exports = router;
