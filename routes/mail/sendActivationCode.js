const express = require('express');
const Brevo = require('@getbrevo/brevo');
const Activation = require("../../src/models/activation");
const User = require('../../src/models/users');
const router = express.Router();
router.use(express.json())
router.post('/', async function (req, res, next) {
    const payload = req.body;
    console.log('send Activation code')
    try {
        var val = Math.floor(1000 + Math.random() * 9000);
        
        const a = new Activation();
        await a.insert({ user_id: payload.user_id, code: val });
        const u = new User();
        const user = await u.find({ id: payload.user_id })
        
        var defaultClient = Brevo.ApiClient.instance;

       
        var apiKey = defaultClient.authentications['api-key'];
        apiKey.apiKey = process.env.BREVO_APIKEY;
        
        var partnerKey = defaultClient.authentications['partner-key'];
        partnerKey.apiKey = process.env.BREVO_APIKEY;
        
        const sendSmtpEmail = new Brevo.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email



        const apiInstance = new Brevo.TransactionalEmailsApi();

        sendSmtpEmail.sender = { name: 'MyNursingAngel', email: process.env.BREVO_EMAIL };

        sendSmtpEmail.to = [{ email: user.email }];

       
        const ids = {
            fr: 4,
            en: 6,
            nl: 5
        }
        sendSmtpEmail.templateId = ids[user.lang];
        sendSmtpEmail.params = {
            FIRSTNAME: user.firstname,
            code:val
        }

        console.log( user,sendSmtpEmail)

        apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
            console.log('API called successfully. Returned data: ' + data);
        }, function (error) {
            console.error("error",error);
        });

        return res.json({ user: user, code: val });
    } catch (error) {
        return res.json(error);
    }
});
module.exports = router;
