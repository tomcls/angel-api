const express = require('express');
const async = require('async');
const Survey = require("../../src/models/surveys");
const router = express.Router();
router.use(express.json())
router.post('/', async function(req, res, next) {
  const payload = req.body;
  try {
    const u = new Survey();
    let r = await u.concatEffects(payload)
    return res.json({
      surveys : r,
      count: r.length
    });
   
  /*  async.parallel([
      function(callback) {
        u.concatEffects(payload).then(function(r){
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
      
    });*/
  } catch (error) {
    return res.json(error);
  }
});
module.exports = router;
