const express = require('express');
const async = require('async');
const Dashboard = require("../../src/models/dashboard");
const router = express.Router();
router.use(express.json())
router.post('/',  function(req, res, next) {
  const payload = req.body;
  try {
    const u = new Dashboard();
    
    async.parallel([
      function(callback) {
        u.moods(payload).then(function(r){
          callback(null, r);
        }).catch(function(error){
          callback(error);
        });
      }
    ],  function(err, results) {
      return res.json({
        moods : results[0]
      });
    });
  } catch (error) {
    return res.json(error);
  }
});
module.exports = router;
