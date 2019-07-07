let nodemailer=require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'webgamesystem7788@gmail.com',
      pass: '1997424A'
    }
  });

  module.exports=transporter;