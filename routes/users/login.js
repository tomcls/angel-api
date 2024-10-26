const express = require('express');
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken")
const User = require("../../src/models/users");
const Doctor = require('../../src/models/doctors');
const Patient = require('../../src/models/patients');
const Nurse = require('../../src/models/nurses');
const Scientist = require('../../src/models/scientists');
const router = express.Router();
router.use(express.json())
router.post('/', async function (req, res, next) {
  const apiKey = req.headers["apikey"];
  if (apiKey == null) {
    return res.status(400).json({ error: 'apikey not present' });
  }
  const payload = req.body;
  try {
    console.group(payload);
    const u = new User();
    const user = await u.find(payload);
    if (user && user.active) {
      if (user && user.password && user.password === CryptoJS.MD5(JSON.stringify(payload.password)).toString()) {
        const o = {
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          type: user.type,
          date_created: user.date_created,
          avatar: user.avatar
        }
        const p = new Patient();
        const patient = await p.find({user_id:user.id});
        if(patient && patient.user_id) {
          user.patient_id = patient.patient_id;
        }
        const d = new Doctor();
        const doctor = await d.find({user_id:user.id});
        
        if(doctor && doctor.user_id) {
          user.doctor_id = doctor.doctor_id;
        }
        const n = new Nurse();
        const nurse = await n.find({user_id:user.id});
        if(nurse && nurse.user_id) {
          user.nurse_id = nurse.nurse_id;
        }
        const s = new Scientist();
        const scientist = await s.find({user_id:user.id});
        if(scientist && scientist.user_id) {
          user.scientist_id = scientist.scientist_id;
        }
        const token = jwt.sign(o, process.env.API_SECRET);
        if(payload.token_notification && payload.token_notification != '') {
          await u.update({'id':user.id,'token_notification':payload.token_notification});
        }
        return  res.json({user:user, accessToken: token});
      } else {
        return  res.json({ error: 'password not correct' });
      }
    } else {
      return  res.json({ error: 'error user not found or not yet actif' });
    }
  } catch (error) {
    return res.json({ error: error });
  }
});
module.exports = router;
