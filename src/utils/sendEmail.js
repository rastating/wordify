const sg = require('@sendgrid/mail');

const config = require('../config');

sg.setApiKey(config.sendgridApi);
module.exports = (to, subject, text, html) => {
  sg.send({
    from: config.sendgridFrom,
    to,
    subject,
    text,
    html
  });
};
