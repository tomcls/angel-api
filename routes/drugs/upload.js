const express = require('express');
const path = require("path");
const router = express.Router();
const multer = require('multer');
const Drug = require("../../src/models/drugs");

const storage = multer.diskStorage({
    destination: "./public/drugs/images",
    filename: function (req, file, cb) {
        cb(null, "drug-" + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage, limits: { fileSize: 10000000 } });


router.use(express.json())
router.post('/', upload.single('drug'), async function (req, res, next) {
    const payload = req;
    try {
        if (payload && payload.file && payload.file.filename) {
            const u = new Drug();
           let r =  await u.update({ id: req.body.drugId,image: payload.file.filename });
            res.json({ success: 'File well uploaded', filename: payload.file.filename });
        } else {
            res.json({ error: 'Error file not uploaded' });
        }
    } catch (error) {
        return res.json(error);
    }
});
module.exports = router;
