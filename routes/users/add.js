const express = require('express');
const Brevo = require('@getbrevo/brevo');
const jwt = require("jsonwebtoken")
const User = require("../../src/models/users");
const Nurse = require("../../src/models/nurses");
const Doctor = require("../../src/models/doctors");
const Scientist = require("../../src/models/scientists");
const CryptoJS = require("crypto-js");
const Patient = require('../../src/models/patients');
const router = express.Router();
router.use(express.json())
router.post('/', async function (req, res, next) {
  const payload = req.body;
  try {
    
    let o = {
      firstname: payload.firstname,
      lastname: payload.lastname,
      email: payload.email.toLowerCase(),
      phone: payload.phone ?? null,
      sex: payload.sex ?? null,
      address: payload.address ?? null,
      street_number: payload.street_number ?? null,
      zip: payload.zip ?? null,
      city: payload.city ?? null,
      country: payload.country ?? null,
      lang: payload.lang ?? 'en',
      birthday: payload.birthday ?? null,
      role: payload.role ? payload.role : 'V',
      password: payload.password ? CryptoJS.MD5(JSON.stringify(payload.password)).toString() : CryptoJS.MD5(JSON.stringify('Password must be changed')).toString(),
      active: payload.active ? payload.active : 'N'
    }
    console.log('payload',payload)
    console.log('o',o)
    const token = jwt.sign(o, process.env.API_SECRET, { expiresIn: "20000m" });
    const u = new User();
    let userExist = await u.find({ email: o.email });
    if (userExist && userExist.id) {
      return res.json({ 'error': 'user_exists', user: userExist, accessToken: token });
    }
    const user = await u.add(o);
    let child = null;
    switch (payload.type) {
      case 'nurse':
        const n = new Nurse();
        child = await n.add({ user_id: user.inserted_id });
        user.nurse_id = child.inserted_id;
        break;
      case 'doctor':
        const d = new Doctor();
        child = await d.add({ user_id: user.inserted_id });
        user.doctor_id = child.inserted_id;
        break;
      case 'lab':
        const s = new Scientist();
        child = await s.add({ user_id: user.inserted_id });
        user.scientist_id = child.inserted_id;
        break;
      case 'patient':
        const p = new Patient();
        child = await p.add({ user_id: user.inserted_id });
        user.patient_id = child.inserted_id;
        break;
    }

    o.inserted_id = user.inserted_id;
    o.id = user.inserted_id;

    //


    var defaultClient = Brevo.ApiClient.instance;

    // Configure API key authorization: api-key
    var apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_APIKEY;

    var partnerKey = defaultClient.authentications['partner-key'];
    partnerKey.apiKey = process.env.BREVO_APIKEY;

    const sendSmtpEmail = new Brevo.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email

    const apiInstance = new Brevo.TransactionalEmailsApi();

    sendSmtpEmail.sender = { name: 'MyNursingAngel', email: process.env.BREVO_EMAIL };

    sendSmtpEmail.to = [{ email: o.email }];
    const ids = {
      fr: 2,
      en: 1,
      nl: 3
    }
    sendSmtpEmail.templateId = ids[o.lang];
    sendSmtpEmail.params = {
      FIRSTNAME: o.firstname
    }

    console.log(sendSmtpEmail)

    apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
      console.log('API called successfully. Returned data: ' + data);
    }, function (error) {
      console.error("error", error);
    });



    //
    return res.json({ inserted_id: user.inserted_id, user: o, accessToken: token });
  } catch (error) {
    console.log('error', error)
    return res.json(error);
  }
});
module.exports = router;
