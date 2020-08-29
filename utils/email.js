const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');
const catchAsynchronousError = require('./../utils/catchAsynchronousError');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = process.env.EMAIL_FROM;
  }

  createNodemailerTransport() {
    console.log(process.env);
    if (process.env.NODE_ENV === 'prod') {
      // Sendgrid, real email transporter
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_POST,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      html,
      text: htmlToText.fromString(html),
    };

    await this.createNodemailerTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the cowork.io family !🥰🥳 ');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token. [valid only for 10 minutes]'
    );
  }
};
