const express = require('express');
const User = require("../../src/models/users");
const Nurse = require("../../src/models/nurses");
const Doctor = require("../../src/models/doctors");
const Scientist = require("../../src/models/scientists");
const CryptoJS = require("crypto-js");
const router = express.Router();
router.use(express.json())
router.post('/', async function(req, res, next) {
  const payload = req.body;
  try {
    let o = {
      firstname: payload.firstname,
      lastname: payload.lastname,
      email: payload.email,
      phone: payload.phone,
      sex: payload.sex,
      address: payload.address,
      street_number: payload.street_number,
      zip: payload.zip,
      city: payload.city,
      country: payload.country,
      lang: payload.lang,
      birthday: payload.birthday,
      role: payload.role?payload.role:'V',
      password: payload.password?CryptoJS.MD5(JSON.stringify(payload.password)).toString():CryptoJS.MD5(JSON.stringify('Password must be changed')).toString(),
      active: payload.active?payload.active:'N'
    }
    const u = new User();
    let userExist = await u.find({email: o.email});
    if(userExist && userExist.id) {
      return res.json({'error': 'user_exists'});
    }
    const user = await u.add(o);
    let child = null;
    switch (payload.type) {
      case 'nurse':
        const n = new Nurse();
        child = await n.add({user_id:user.inserted_id});
        user.nurse_id = child.inserted_id;
        break;
      case 'doctor':
        const d = new Doctor();
        child = await d.add({user_id:user.inserted_id});
        user.doctor_id = child.inserted_id;
        break;
      case 'lab':
        const s = new Scientist();
        child = await s.add({user_id:user.inserted_id});
        user.scientist_id = child.inserted_id;
        break;
    }
    return res.json(user);
  } catch (error) {
    console.log('error',error)
    return res.json(error);
  }
});
module.exports = router;
