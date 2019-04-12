
#### 使用nodemailer发送邮件
###### 1.简介
nodemailer是一个nodejs应用的邮件服务模块

![logo](https://nodemailer.com/nm_logo_200x136.png)

- 官网地址：https://nodemailer.com
- GitHub地址：https://github.com/nodemailer/nodemailer

###### 2.nodemailer功能特性
- 支持Unicode编码,包括emoji
- 支持Window系统环境
- 支持HTML内容和纯文本内容
- 支持附件
- 支持HTML内容中嵌入图片附件
- 支持TLS/STARTTLS安全的邮件发送
- 除了支持内置的transport方法，还支持其他插件实现的transport方法
- 支持DKIM签署消息
- 支持自定义插件处理消息
- 支持XOAUTH2登录验证
- 支持SMTP连接代理
- 支持ES6
- 支持从ethereal.email自动生成的电子邮件测试帐户

###### 3.要求
- node.js v6.0.0或更高版本

###### 4.安装
~~~
npm install nodemailer --save
~~~

###### 5.官方示例
~~~
"use strict";
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function main(){

  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass // generated ethereal password
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: "bar@example.com, baz@example.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>" // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

main().catch(console.error);
~~~
- 这是一个生成了Ethereal的账户，发送纯文本和HTML正文电子邮件的完整示例。

###### 6.使用自己qq邮箱或163邮箱发送邮件，发送多人邮箱
- 备注：使用qq邮箱发送需要[开启POP3/SMTP服务](https://jingyan.baidu.com/article/425e69e61e9178be15fc168a.html)，复制授权码配置在pass中。163邮箱默认已开通。
- 6.1 [.env文件配置](https://niexq.github.io/2019/04/01/nodejs%E9%A1%B9%E7%9B%AE%EF%BC%8C%E4%BB%8E-env%E6%96%87%E4%BB%B6%E5%8A%A0%E8%BD%BD%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F/)
~~~
RUN_LEVEL           = production

MAIL_HOST           = smtp.exmail.qq.com
MAIL_SERVICE        = QQ
MAIL_PORT           = 465
MAIL_SECURE         = true
MAIL_SECURE_CONNECTION         = true
MAIL_USER           = ******@qq.com
MAIL_PASS           = ******
MAIL_NICKNAME       = 👻测试nodemailer发邮件👻
MAIL_TO             = ******@gmail.com,******@163.com,******@qq.com
~~~

- 6.2 config.js文件配置
~~~
'use strict';

const argv = require('yargs').argv;
require('dotenv').config({
  path: argv.env,
});
const env = process.env;

module.exports = {
  mail: {
    // host: env.MAIL_HOST,     // 官方demo方式，暂时注释
    service: env.MAIL_SERVICE,  // 使用内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known
    port: env.MAIL_PORT,
    // secure: env.MAIL_SECURE, // 官方demo方式，暂时注释
    secureConnection: env.MAIL_SECURE_CONNECTION,
    auth: {
      user: env.MAIL_USER,
      pass: env.MAIL_PASS, // 如果是使用QQ邮箱发送，此密码不是邮箱账户的密码而是授权码。
    },
    from: `${env.MAIL_NICKNAME}<${env.MAIL_USER}>`,
    to: env.MAIL_TO,
  },
};
~~~

- 6.3 lib/sendMail.js文件配置
~~~
const nodemailer = require('nodemailer');
const mailconf = require('../config').mail;

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport(mailconf);

// setup email data with unicode symbols
const mailOptions = {
  from: mailconf.from,                          // sender address
  to: mailconf.to,                              // list of receivers
  subject: '测试标题',                          // Subject line
  text: 'Hello world?',                         // plain text body
  html: '<b>Hello world?</b>',                  // html body
};

// send mail with defined transport object
const sendMail = ({ message = '来自测试nodemailer发邮件', subject = '这个一个默认的测试标题' }) => {
  if (process.env.RUN_LEVEL !== 'production') {    // 测试环境可跳过
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
~~~

- 6.4 index.js文件代码
~~~
require('colors');

const sendMail = require('./lib/sendMail');

// 使用封装好的发送邮件方法（可按项目需求，需要的地方调用此方法）
sendMail({
  message: '这是邮件测试内容',
  subject: '邮件标题hello world'
});


console.log('send mail start'.blue);
~~~
- 使用163邮箱发送雷同，运行程序node index.js，成功将返回发送成功，messageId为******。


##### 有关更多详细信息，请参阅：
[SMTP transport](https://nodemailer.com/smtp/)

[Message configuration](https://nodemailer.com/message/configuration)

[HTML Email 编写指南](http://www.ruanyifeng.com/blog/2013/06/html_email.html)





