var admin = require("firebase-admin");
const dotenv = require('dotenv');
dotenv.config();
var serviceAccount = require("./angel-154d6-firebase-adminsdk-75sdk-bac7a51b51.json");
const Drug = require("./src/models/drugs");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
async function getPatientTreatments(user) {
    // const todayDate = new Date().toISOString().split('T')[0];
    const drugModel = new Drug();
    const patientTreatments = await drugModel.getUserDrugs({
        for_push: 'y',
    });
    const weekDay = {
        1: 'mon',
        2: 'tue',
        3: 'wed',
        4: 'thu',
        5: 'fri',
        6: 'sat',
        7: 'sun',
    };
    const today = new Date();
    //today.setHours(0, 0, 0, 0);
    const currentHour = today.getHours();
    console.log('currentHour', currentHour)
    let foundNotification = false;
    if (patientTreatments && patientTreatments.length) {

        const dayOfTheWeek = today.getDay();

        for (let index = 0; index < patientTreatments.length; index++) {
            const element = patientTreatments[index];
            if (
                new Date(element.start_date).getTime() <= today.getTime() &&
                new Date(element.end_date).getTime() >= today.getTime()
            ) {
                let days = JSON.parse(element.days ? element.days : '') ?? null;

                if (
                    (element.repetition === 'week' &&
                        days.indexOf(weekDay[dayOfTheWeek]) > -1) ||
                    element.repetition === 'month'
                ) {
                    let hours =
                        JSON.parse(element.hours ? element.hours : '') ?? null;
                    if (hours && hours.length) {
                        for (let index = 0; index < hours.length; index++) {
                            const elh = hours[index];
                            let el = {
                                listPic: element.image,
                                title: element.name,
                                time: elh + ':00',
                                meal: 'Before meal',
                                day: elh >= 18 ? false : true,
                            };
                            if (currentHour == elh) {

                                await send(
                                    'Time to take pills!',
                                    element.name + '',
                                    element.token_notification
                                );
                            }
                        }
                    }
                }
            }
        }

    } else {
        console.log('The patient has no treatement yet');
    }
};
async function send(title, message, token) {
    let body = {
        token: token,
        notification: {
            title: title,
            body: message
        }
    }
    console.log(body)
    try {
        const response = await admin.messaging().send(body);
        console.log('msg sent', response);
    } catch (error) {
        console.log(error)
    }
}
getPatientTreatments().then(function () {
    console.log('end');
    process.exit(1);
});