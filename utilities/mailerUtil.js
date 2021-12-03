'use strict'

const nodemailer = require('nodemailer');
require('dotenv').config('./.env');

let registerMail = (email, username) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'mgn.issuetrackerapi@gmail.com',
            pass: '123issueAdmin'
        }
    });
    let mailOptions = {
        from: 'mgn.issuetrackerapi@gmail.com',
        to: email,
        subject: 'Welcome to IssueTrackerAPI',
        text: `Hi ${username}! Thanks for Registering to IssueTrackerAPI. `
    };
    // send mail from defined transport object
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) return console.log(err);
        else console.log('Email sent successfully.');
    });
}

module.exports = {
    registerMail: registerMail
};