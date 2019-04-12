
require('colors');

const sendMail = require('./lib/sendMail');

sendMail({
  message: '这是邮件测试内容',
  subject: '邮件标题hello world'
});


console.log('send mail start'.blue);