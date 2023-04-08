var db = require('../config/connection')
var collection = require('../config/collection')
var adminHelpers = require('../helpers/adminHelpers')
var nodemailer = require('nodemailer');

module.exports = {
    sendFeedback: (feedback) => {
        return new Promise(async (resolve, reject) => {
            let mailSent = {};
            var userEmail = "";

            var today = new Date();
            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            // var dateTime = date + ' ' + time;
           // console.log(dateTime);

           feedback.Date = date;
           feedback.Time = time;

            if (feedback.email) {
                userEmail = feedback.email;
            }

            await db.get().collection(collection.USER_FEEDBACK).insertOne(feedback);


            var from = "mnihal.cy123@gmail.com";
            var to = "mnihal.cy@gmail.com";
            var subject = "feedback From Course.com";
            var message = feedback.Feedback + " by " + userEmail +  " on " + date +" time: "+ time;

            var transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: 'mnihal.cy123@gmail.com',            // mnihalcy@gmail.com      'mnihal.cy123@gmail.com',
                    pass: 'wpbdwpjsasatxvma'               // btpyaxmlighzzaok              'wpbdwpjsasatxvma'
                }
            });
            var mailOptions = {
                from: from,
                to: to,
                subject: subject,
                text: message
            };
            transporter.sendMail(mailOptions, (error, _info) => {
                if (error) {
                    console.log(error);
                    mailSent.error;
                } else {
                    mailSent.Status = true;
                    console.log("Email sent ");
                }
            })
            resolve(mailSent);

        })
    }
}
