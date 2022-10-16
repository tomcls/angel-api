const express = require('express');
const Notification = require("../../src/models/notifications");
const router = express.Router();
router.use(express.json())
router.post('/', async function(req, res, next) {
  const payload = req.body;
  try {
    const u = new Notification();
    const notification = await u.find(payload);
    res.json(notification);
  } catch (error) {
    console.log(error)
    res.json(error);
  }
});
module.exports = router;
