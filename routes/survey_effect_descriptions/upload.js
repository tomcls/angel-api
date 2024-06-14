const express = require('express');
const path = require("path");
const router = express.Router();
const multer = require('multer');
let fs = require('fs-extra');
const SurveyEffectDescriptions = require('../../src/models/surveyEffectDescriptions');

 const storage = multer.diskStorage({
       destination: (req, file, callback) => {
        let userId = req.body.userId;
        let path = `./public/survey-effects/${userId}`;
        fs.mkdirsSync(path);
        callback(null, path);
      },
    filename: function (req, file, cb) {
        cb(null, "side-effect-" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage, limits: { fileSize: 10000000, fieldSize: 25 * 1024 * 1024 } });


router.use(express.json())
router.post('/', upload.single('avatar'), async function (req, res, next) {
    const payload = req;
    try {
        if (payload && payload.file && payload.file.filename) {
            const surveyEffect = new SurveyEffectDescriptions();
            const s = await surveyEffect.get({user_id:req.body.userId});
            if(s && s.id) {
              let r = await surveyEffect.update({ id: s.id, image: payload.file.filename });
            } else {
              const rInserted = await surveyEffect.insert({ user_id: req.body.userId, image: payload.file.filename,date:new Date() });
            }
            res.json({ success: 'File well uploaded', filename: payload.file.filename });
        } else {
            res.json({ error: 'Error file not uploaded' });
        }
    } catch (error) {
        return res.json(error);
    }
});
module.exports = router;
