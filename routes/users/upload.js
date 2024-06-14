const express = require('express');
const path = require("path");
const router = express.Router();
const multer = require('multer');
const User = require("../../src/models/users");

const storage = multer.diskStorage({
    destination: "./public/uploads/",
    filename: function (req, file, cb) {
        cb(null, "avatar-" + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage, limits: { fileSize: 10000000, fieldSize: 25 * 1024 * 1024 } });


router.use(express.json())
router.post('/', upload.single('avatar'), async function (req, res, next) {
    const payload = req;
    try {
        if (payload && payload.file && payload.file.filename) {
            const u = new User();
            let r = await u.update({ id: req.body.userId, avatar: payload.file.filename });
            res.json({ success: 'File well uploaded', filename: payload.file.filename });
        } else {
            res.json({ error: 'Error file not uploaded' });
        }
    } catch (error) {
        return res.json(error);
    }
});
module.exports = router;
