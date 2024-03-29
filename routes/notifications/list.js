const express = require('express');
const async = require('async');
const Notification = require("../../src/models/notifications");
const router = express.Router();
router.use(express.json())
router.post('/',  function(req, res, next) {
  const payload = req.body;
  try {
    const u = new Notification();
    
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
      const notifications = results[0];
      return res.json({
        users : notifications,
        total: results[1]
      });
    });
  } catch (error) {
    return res.json(error);
  }
});
module.exports = router;
