const nodemailer = require('nodemailer');
const catchAsynchronousError = require('./../utils/catchAsynchronousError');

const sendEmail = catchAsynchronousError(async (options) => {
  // create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_POST,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // define the email options
  const mailOptions = {
    from: 'cowork.io <noreply@cowork.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: ''
  };
  // send the email with nodemailer
  await transporter.sendMail(mailOptions);
});

module.exports = sendEmail;
