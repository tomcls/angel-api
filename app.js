const dotenv = require('dotenv');
dotenv.config();
const bodyParser = require("body-parser");
var cors = require('cors')
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const jwt = require("jsonwebtoken")

const userListRouter = require('./routes/users/list');
const userAddRouter = require('./routes/users/add');
const userUpdateRouter = require('./routes/users/update');
const userGetRouter = require('./routes/users/get');
const userRequestPasswordRouter = require('./routes/users/request-password');
const userResetPasswordRouter = require('./routes/users/reset-password');
const deleteRouter = require('./routes/users/delete');
const checkAuth = require('./routes/users/check-auth');
const loginRouter = require('./routes/users/login');
const uploadRouter = require('./routes/users/upload');
// patient
const patientListRouter = require('./routes/patients/list');
const patientAddRouter = require('./routes/patients/add');
const patientUpdateRouter = require('./routes/patients/update');
const patientGetRouter = require('./routes/patients/get');
const patientSearchRouter = require('./routes/patients/search');
// doctors
const doctorListRouter = require('./routes/doctors/list');
const doctorAddRouter = require('./routes/doctors/add');
const doctorUpdateRouter = require('./routes/doctors/update');
const doctorGetRouter = require('./routes/doctors/get');
const doctorGetPatientsRouter = require('./routes/doctors/patients');
const doctorAddPatientRouter = require('./routes/doctors/addPatient');
// nurses
const nurseListRouter = require('./routes/nurses/list');
const nurseAddRouter = require('./routes/nurses/add');
const nurseUpdateRouter = require('./routes/nurses/update');
const nurseGetRouter = require('./routes/nurses/get');
const nurseGetPatientsRouter = require('./routes/nurses/patients');
const nurseAddPatientRouter = require('./routes/nurses/addPatient');
// nurses
const scientistListRouter = require('./routes/scientists/list');
const scientistAddRouter = require('./routes/scientists/add');
const scientistUpdateRouter = require('./routes/scientists/update');
const scientistGetRouter = require('./routes/scientists/get');
const scientistGetPatientsRouter = require('./routes/scientists/patients');
const scientistAddPatientRouter = require('./routes/scientists/addPatient');
// drugs
const drugListRouter = require('./routes/drugs/list');
const drugAddRouter = require('./routes/drugs/add');
const drugUpdateRouter = require('./routes/drugs/update');
const drugGetRouter = require('./routes/drugs/get');
const drugSearchRouter = require('./routes/drugs/search');
const drugDeleteRouter = require('./routes/drugs/delete');
//  drug descriptions
const drugDescriptionAddRouter = require('./routes/drug_descriptions/add');
const drugDescriptionUpdateRouter = require('./routes/drug_descriptions/update');

// hospitals
const hospitalListRouter = require('./routes/hospitals/list');
const hospitalAddRouter = require('./routes/hospitals/add');
const hospitalUpdateRouter = require('./routes/hospitals/update');
const hospitalGetRouter = require('./routes/hospitals/get');
const hospitalDeleteRouter = require('./routes/hospitals/delete');
// laboratories
const laboratoryListRouter = require('./routes/laboratories/list');
const laboratoryAddRouter = require('./routes/laboratories/add');
const laboratoryUpdateRouter = require('./routes/laboratories/update');
const laboratoryGetRouter = require('./routes/laboratories/get');
const laboratoryDeleteRouter = require('./routes/laboratories/delete');
// treatments
const treatmentListRouter = require('./routes/treatments/list');
const treatmentAddRouter = require('./routes/treatments/add');
const treatmentUpdateRouter = require('./routes/treatments/update');
const treatmentGetRouter = require('./routes/treatments/get');
const treatmentGetDrugsRouter = require('./routes/treatments/drugs');
const treatmentGetPatientsRouter = require('./routes/treatments/patients');
const treatmentAddDrugRouter = require('./routes/treatments/addDrug');
const treatmentAddPatientRouter = require('./routes/treatments/addPatient');
const treatmentDeleteRouter = require('./routes/treatments/delete');
//  treatment descriptions
const treatmentDescriptionAddRouter = require('./routes/treatment_descriptions/add');
const treatmentDescriptionUpdateRouter = require('./routes/treatment_descriptions/update');
// sideEffects
const sideEffectListRouter = require('./routes/side_effects/list');
const sideEffectAddRouter = require('./routes/side_effects/add');
const sideEffectUpdateRouter = require('./routes/side_effects/update');
const sideEffectGetRouter = require('./routes/side_effects/get');
const sideEffectSearchRouter = require('./routes/side_effects/search');
const sideEffectDeleteRouter = require('./routes/side_effects/delete');
//  sideEffect descriptions
const sideEffectDescriptionAddRouter = require('./routes/side_effect_descriptions/add');
const sideEffectDescriptionUpdateRouter = require('./routes/side_effect_descriptions/update');
// moods
const moodListRouter = require('./routes/moods/list');
const moodAddRouter = require('./routes/moods/add');
const moodUpdateRouter = require('./routes/moods/update');
const moodGetRouter = require('./routes/moods/get');
const moodSearchRouter = require('./routes/moods/search');
const moodDeleteRouter = require('./routes/moods/delete');
//  mood descriptions
const moodDescriptionAddRouter = require('./routes/mood_descriptions/add');
const moodDescriptionUpdateRouter = require('./routes/mood_descriptions/update');
//  surveys 
const surveyMoodsRouter = require('./routes/surveys/moods');
//  dashboard 
const dashboardMoodsRouter = require('./routes/dashboard/moods');

const app = express();
app.use(cors())
app.use(logger('dev'));
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.all('*', validateToken);
console.log(__dirname + '/public');
app.use('/public/uploads',express.static(__dirname + '/public/uploads'));
app.use('/users/list', userListRouter);
app.use('/users/add', userAddRouter);
app.use('/users/get', userGetRouter);
app.use('/users/update', userUpdateRouter);
app.use('/users/request-password', userRequestPasswordRouter);
app.use('/users/reset-password', userResetPasswordRouter);
app.use('/users/login', loginRouter);
app.use('/users/check-auth', checkAuth);
app.use('/users/upload', uploadRouter);
app.use('/users/delete', deleteRouter);
// patient
app.use('/patients/list', patientListRouter);
app.use('/patients/add', patientAddRouter);
app.use('/patients/get', patientGetRouter);
app.use('/patients/update', patientUpdateRouter);
app.use('/patients/search', patientSearchRouter);
// doctors
app.use('/doctors/list', doctorListRouter);
app.use('/doctors/add', doctorAddRouter);
app.use('/doctors/get', doctorGetRouter);
app.use('/doctors/update', doctorUpdateRouter);
app.use('/doctors/patients', doctorGetPatientsRouter);
app.use('/doctors/add-patient', doctorAddPatientRouter);
// nurses
app.use('/nurses/list', nurseListRouter);
app.use('/nurses/add', nurseAddRouter);
app.use('/nurses/get', nurseGetRouter);
app.use('/nurses/update', nurseUpdateRouter);
app.use('/nurses/patients', nurseGetPatientsRouter);
app.use('/nurses/add-patient', nurseAddPatientRouter);
// scientists
app.use('/scientists/list', scientistListRouter);
app.use('/scientists/add', scientistAddRouter);
app.use('/scientists/get', scientistGetRouter);
app.use('/scientists/update', scientistUpdateRouter);
app.use('/scientists/patients', scientistGetPatientsRouter);
app.use('/scientists/add-patient', scientistAddPatientRouter);
// drugs
app.use('/drugs/list', drugListRouter);
app.use('/drugs/add', drugAddRouter);
app.use('/drugs/get', drugGetRouter);
app.use('/drugs/update', drugUpdateRouter);
app.use('/drugs/search', drugSearchRouter);
app.use('/drugs/delete', drugDeleteRouter);
// drug descriptions
app.use('/drug-descriptions/add', drugDescriptionAddRouter);
app.use('/drug-descriptions/update', drugDescriptionUpdateRouter);
// hospitals
app.use('/hospitals/list', hospitalListRouter);
app.use('/hospitals/add', hospitalAddRouter);
app.use('/hospitals/get', hospitalGetRouter);
app.use('/hospitals/update', hospitalUpdateRouter);
app.use('/hospitals/delete', hospitalDeleteRouter);

// laboratories
app.use('/laboratories/list', laboratoryListRouter);
app.use('/laboratories/add', laboratoryAddRouter);
app.use('/laboratories/get', laboratoryGetRouter);
app.use('/laboratories/update', laboratoryUpdateRouter);
app.use('/laboratories/delete', laboratoryDeleteRouter);

// treatments
app.use('/treatments/list', treatmentListRouter);
app.use('/treatments/add', treatmentAddRouter);
app.use('/treatments/get', treatmentGetRouter);
app.use('/treatments/update', treatmentUpdateRouter);
app.use('/treatments/drugs', treatmentGetDrugsRouter);
app.use('/treatments/patients', treatmentGetPatientsRouter);
app.use('/treatments/add-drug', treatmentAddDrugRouter);
app.use('/treatments/add-patient', treatmentAddPatientRouter);
app.use('/treatments/delete', treatmentDeleteRouter);
// treatment descriptions
app.use('/treatment-descriptions/add', treatmentDescriptionAddRouter);
app.use('/treatment-descriptions/update', treatmentDescriptionUpdateRouter);
// sideEffects
app.use('/side-effects/list', sideEffectListRouter);
app.use('/side-effects/add', sideEffectAddRouter);
app.use('/side-effects/get', sideEffectGetRouter);
app.use('/side-effects/update', sideEffectUpdateRouter);
app.use('/side-effects/search', sideEffectSearchRouter);
app.use('/side-effects/delete', sideEffectDeleteRouter);
// side effects descriptions
app.use('/side-effect-descriptions/add', sideEffectDescriptionAddRouter);
app.use('/side-effect-descriptions/update', sideEffectDescriptionUpdateRouter);
// moods
app.use('/moods/list', moodListRouter);
app.use('/moods/add', moodAddRouter);
app.use('/moods/get', moodGetRouter);
app.use('/moods/update', moodUpdateRouter);
app.use('/moods/search', moodSearchRouter);
app.use('/moods/delete', moodDeleteRouter);
// side effects descriptions
app.use('/mood-descriptions/add', moodDescriptionAddRouter);
app.use('/mood-descriptions/update', moodDescriptionUpdateRouter);
// surveys
app.use('/surveys/moods', surveyMoodsRouter);
// dashboard
app.use('/dashboard/moods', dashboardMoodsRouter);

app.set('port', process.env.PORT || 3000);

const server = app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port);
});
function validateToken(req, res, next) {
    const token = req.headers["authorization"];
    if (req.path.indexOf('/public/') >= 0 || req.path === '/users/login' || 
        req.path === '/users/request-password' ||
        req.path === '/users/reset-password'||
        req.path === '/users/check-auth' ||
        req.path === '/users/add' ) return next();
    //the request header contains the token "Bearer <token>", split the string and use the second value in the split array.
    if (token == null) return res.status(400).json({error:"Authorization not present"});
    //console.log("token = ",token)
    jwt.verify(token, process.env.API_SECRET, (err, user) => {
      //  console.log(err, user)
        if (err) {
           return res.status(403).json({error:"Authorization not valid"})
        }
        else {
            next() //proceed to the next action in the calling function
        }
    }) //end of jwt.verify()*/
}