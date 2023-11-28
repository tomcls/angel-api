const express = require('express');
const Brevo = require('@getbrevo/brevo');
const Activation = require("../../src/models/activation");
const User = require('../../src/models/users');
const router = express.Router();
router.use(express.json())
router.post('/', async function (req, res, next) {
    const payload = req.body;
    try {
        var val = Math.floor(1000 + Math.random() * 9000);
        console.log(val), payload.user_id;
        const a = new Activation();
        const activation = await a.insert({ user_id: payload.user_id, code: val});
        const u = new User();
        const user = await u.find({id:payload.user_id})
console.log(user.email)
var defaultClient = Brevo.ApiClient.instance;

// Configure API key authorization: api-key
var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = "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"
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//apiKey.apiKeyPrefix['api-key'] = "Token"

// Configure API key authorization: partner-key
var partnerKey = defaultClient.authentications['partner-key'];
partnerKey.apiKey = "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"
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//partnerKey.apiKeyPrefix['partner-key'] = "Token"

// var api = new Brevo.AccountApi()
// api.getAccount().then(function(data) {
//   console.log('API called successfully. Returned data: ' + data);
// }, function(error) {
//   console.error(error);
// });
       
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //apiKey.apiKeyPrefix = 'Token';

        // Configure API key authorization: partner-key
        // var partnerKey = defaultClient.authentications['partner-key'];
        // partnerKey.apiKey = 'YOUR API KEY';
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //partnerKey.apiKeyPrefix = 'Token';
        const sendSmtpEmail = new Brevo.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email
        
        const apiInstance = new Brevo.TransactionalEmailsApi();
        
        sendSmtpEmail.sender = { name: 'thomas', email: 'tomclassius@gmail.com' };
       
        sendSmtpEmail.to = [{ email: user.email }];
       
        sendSmtpEmail.subject = 'Activation code';
       
        sendSmtpEmail.htmlContent = 'Votre code d\'activation est le '+val;
     
        console.log(sendSmtpEmail)

        apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data) {
        console.log('API called successfully. Returned data: ' + data);
        }, function(error) {
        console.error(error);
        });

        return res.json({user:user,code:val});
    } catch (error) {
        return res.json(error);
    }
});
module.exports = router;
