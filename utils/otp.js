const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer')
const hbs = require('handlebars')
const path = require('path')
const fs = require('fs');

const OTP = require('../Model/otp')
const db = require('../config/connection')


module.exports = {
  sendOtp: async (email) => {

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {

        user: process.env.USER_EMAIL,
        pass: process.env.APP_PASSWORD
      }
    })

    const otp = `${Math.floor(1000 + Math.random() * 9000)}`

    const hbsFile = fs.readFileSync(path.join(__dirname, '../Public/mail/Reset-otp.hbs'), 'utf8')
    const compiledHtml = hbs.compile(hbsFile)

    let mailOptions = {
      from: process.env.USER_EMAIL,
      to: email,
      subject: 'Password Reset',
      html: compiledHtml({ email, otp })
    };

    transport.sendMail(mailOptions)
      .catch((err) => {
        throw err
      })
    await OTP.create({ email, otp })
  },

  verifyOtp: async (email, otp) => {
    const otpRecord = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    if (!otpRecord) {
      return false;
    }
    if (otp != otpRecord.otp) {
      return false;
    }
    OTP.deleteMany({ email })
    return true;
  }
}