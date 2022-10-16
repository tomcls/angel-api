const express = require('express');
const Notification = require("../../src/models/notifications");
const router = express.Router();
router.use(express.json())
router.post('/', async function(req, res, next) {
  const payload = req.body;
  try {
    const u = new Notification();
    const m = await u.delete(payload);
    res.json(m);
  } catch (error) {
    res.json(error);
  }
});
module.exports = router;
