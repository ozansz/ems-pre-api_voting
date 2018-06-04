import uuidv4 from 'uuid/v4'
import nodemailer from 'nodemailer'

import config from './config'

module.exports.send_create_mail = (to, secure_token) => {
  nodemailer.createTestAccount((err, account) => {
    let transporter = nodemailer.createTransport({
      //host: 'imap.gmail.com',
      //port: 993,
      //secure: true,
      service: 'gmail',
      auth: {
        user: config.mailer.user,
        pass: config.mailer.pass
      }
    })

    let mailOptions = {
      from: '"IEEE ODTÜ Elektrik ve Elektronik Proje Fuarı 2018" <eepf@ieee.metu.edu.tr>', // sender address
      to: to, // list of receivers
      subject: 'Oylama İçin Kaydınız Oluşturuldu', // Subject line
      //text: 'Hello world?', // plain text body
      html: '<a href="http://ieee.metu.edu.tr/eepf/index.html?secure_token=' + secure_token + '">Oyla!</a>' // html body
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
  })
}

module.exports.asyncWrap = fn =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
};

module.exports.Success = (res, prop) => {
  let response = {};
  response['success'] = true;
  response = Object.assign({}, prop, response);
  return res.status(200).json(response);
}

module.exports.NotFound = (res, prop) => {
  let response = {};
  response['success'] = false;
  response = Object.assign({}, prop, response);
  return res.status(404).json(response);
}

module.exports.InstanceExists = (res, prop) => {
  let response = {};
  response['success'] = false;
  response = Object.assign({}, prop, response);
  return res.status(409).json(response);
}

module.exports.create_access_token = () => {
  return uuidv4()
}
