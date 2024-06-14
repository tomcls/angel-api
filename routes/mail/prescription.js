const express = require('express');
const Brevo = require('@getbrevo/brevo');
const Activation = require("../../src/models/activation");
const User = require('../../src/models/users');
const Drug = require('../../src/models/drugs');
const Doctor = require('../../src/models/doctors');
const Nurse = require('../../src/models/nurses');
const router = express.Router();
router.use(express.json())
router.post('/', async function (req, res, next) {
    const payload = req.body;
    try {
        const u = new User();
        const user = await u.find({ id: payload.user_id })
        const d = new Drug();
        const treatments = await d.findAll({ ids: payload.ids });
        const defaultClient = Brevo.ApiClient.instance;
        const n = new Nurse();
        const nurse = await n.getNurses({ patient_id: user.patient_id });
        if (nurse && nurse.length) {

            // Configure API key authorization: api-key
            var apiKey = defaultClient.authentications['api-key'];
            apiKey.apiKey = process.env.BREVO_APIKEY;

            var partnerKey = defaultClient.authentications['partner-key'];
            partnerKey.apiKey = process.env.BREVO_APIKEY;
            const sendSmtpEmail = new Brevo.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email

            const apiInstance = new Brevo.TransactionalEmailsApi();

            sendSmtpEmail.sender = { name: 'MyNursingAngel', email: process.env.BREVO_EMAIL };

            sendSmtpEmail.to = [{ email: nurse[0].email }];

            sendSmtpEmail.subject = 'Prescription';
            let html = '';
            // html += 'Le patient ' + user.firstname + ' ' + user.lastname + ' demande une nouvelle prescription pour la liste de medicaments suivante <br><br>';
            for (let index = 0; index < treatments.length; index++) {

                const element = treatments[index];
                html += '- ' + element.drug_name + ',  code:' + element.drug_code + ', lab:' + element.laboratory_name + '<br>';
            }
            const ids = {
                fr: 9,
                en: 7,
                nl: 8
            }
            sendSmtpEmail.templateId = ids[user.lang];
            sendSmtpEmail.params = {
                FIRSTNAME: nurse[0].firstname,
                patientFirstname: user.firstname,
                patientLastname: user.lastname,
                products: treatments
            }
            apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
                console.log('API called successfully');
            }, function (error) {
                console.error(error);
            });
        } else {
            return res.json(false);
        }
        return res.json(true);
    } catch (error) {
        return res.json(error);
    }
});
module.exports = router;
