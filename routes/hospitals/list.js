const express = require('express');
const async = require('async');
const Hospital = require("../../src/models/hospitals");
const router = express.Router();
router.use(express.json())
router.post('/',  function(req, res, next) {
  const payload = req.body;
  try {
    const u = new Hospital();
    
    async.parallel([
      function(callback) {
        u.findAll(payload).then(function(r){
          callback(null, r);
        }).catch(function(error){
          callback(error);
        });
      },
      function(callback) {
        u.count(payload).then(function(r){
          callback(null, r);
        }).catch(function(error){
          callback(error);
        });
      }
    ],  function(err, results) {
      const hospitals = results[0];
      return res.json({
        hospitals : results[0],
        total: results[1]
      });
    });
    //hospital.total = total;
    //return res.json(hospital);
  } catch (error) {
    return res.json(error);
  }
});
module.exports = router;
