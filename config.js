'use strict';

const argv = require('yargs').argv;
require('dotenv').config({
  path: argv.env,
});
const env = process.env;

module.exports = {
  mail: {
    // host: env.MAIL_HOST,
    service: env.MAIL_SERVICE, // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
    port: env.MAIL_PORT,
    // secure: env.MAIL_SECURE,
    secureConnection: env.MAIL_SECURE_CONNECTION,     // 使用了 SSL
    auth: {
      user: env.MAIL_USER,
      pass: env.MAIL_PASS,
    },
    from: `${env.MAIL_NICKNAME}<${env.MAIL_USER}>`,
    to: env.MAIL_TO,
  },
};