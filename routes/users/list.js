const express = require('express');
const async = require('async');
const User = require("../../src/models/users");
const router = express.Router();
router.use(express.json())
router.post('/',  function(req, res, next) {
  const payload = req.body;
  try {
    const u = new User();
    
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
      const users = results[0];
      return res.json({
        users : results[0],
        total: results[1]
      });
    });
    //user.total = total;
    //return res.json(user);
  } catch (error) {
    return res.json(error);
  }
});
module.exports = router;
