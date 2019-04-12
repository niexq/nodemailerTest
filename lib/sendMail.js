
const nodemailer = require('nodemailer');
const mailconf = require('../config').mail;

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport(mailconf);

// setup email data with unicode symbols
const mailOptions = {
  from: mailconf.from,                          // sender address
  to: mailconf.to,                     // list of receivers
  subject: '测试标题',                           // Subject line
  text: 'Hello world?',                         // plain text body
  html: '<b>Hello world?</b>',                  // html body
};

// send mail with defined transport object
const sendMail = ({ message = '来自测试nodemailer发邮件', subject = '这个一个默认的测试标题' }) => {
  if (process.env.RUN_LEVEL !== 'production') {
    return;
  }
  mailOptions.subject = subject;
  mailOptions.html = `<b>${message}</b>`;
  mailOptions.text = `${message}`;
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log(`发送成功，messageId为：${info.messageId}`.green);
  });
};

module.exports = sendMail;
