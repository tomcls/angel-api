const express = require('express');
const path = require("path");
const router = express.Router();
const multer = require('multer');
const fs = require('fs-extra');
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

            const surveyEffectdescription = new SurveyEffectDescriptions();
            let r;
            if (req.body.surveyEffectDescriptionId && parseInt(req.body.surveyEffectDescriptionId)) {
                const s = await surveyEffectdescription.get({ survey_effect_description_id: req.body.surveyEffectDescriptionId });
                r = await surveyEffectdescription.update({ id: s.id, image: payload.file.filename });
            } else {
                r = await surveyEffectdescription.insert({ user_id: req.body.userId, image: payload.file.filename, date: new Date() });
            }
            console.log({ success: 'File well uploaded', filename: payload.file.filename, id: r.id });
            return res.json({ success: 'File well uploaded', filename: payload.file.filename, id: r.id });
        } else {
            res.json({ error: 'Error file not uploaded' });
        }
    } catch (error) {
        console.log('error', error)
        return res.json(error);
    }
});
module.exports = router;
