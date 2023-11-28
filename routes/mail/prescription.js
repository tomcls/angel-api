const express = require('express');
const Brevo = require('@getbrevo/brevo');
const Activation = require("../../src/models/activation");
const User = require('../../src/models/users');
const Drug = require('../../src/models/drugs');
const Doctor = require('../../src/models/doctors');
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
        const doc = new Doctor();
        const doctors = await doc.getDoctors({ patient_id: user.patient_id });
        if (doctors && doctors.length) {

            // Configure API key authorization: api-key
            const apiKey = defaultClient.authentications['api-key'];
            apiKey.apiKey = "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"
            var partnerKey = defaultClient.authentications['partner-key'];
            partnerKey.apiKey = "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"

            const sendSmtpEmail = new Brevo.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email

            const apiInstance = new Brevo.TransactionalEmailsApi();

            sendSmtpEmail.sender = { name: user.firstname + ' '+user.lastname, email: user.email };

            sendSmtpEmail.to = [{ email: doctors[0].email }];

            sendSmtpEmail.subject = 'Prescription';
            console.log('Prescription');
            let html = '';
            html += 'Le patient ' + user.firstname + ' ' + user.lastname + ' demande une nouvelle prescription pour la liste de medicaments suivante <br><br>';
            for (let index = 0; index < treatments.length; index++) {
                
                const element = treatments[index];
                html += '- ' + element.drug_name + ',  code:'+element.drug_code+ ', lab:'+element.laboratory_name+ '<br>';
            }
            sendSmtpEmail.htmlContent = html;
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
