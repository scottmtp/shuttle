var sendgrid = require('sendgrid');

var send = function(apiKey, toAddress, shareKey) {
  var sender = sendgrid(apiKey);

  var email = new sender.Email();
  email.addTo(toAddress);
  email.subject = "tryshuttle.com sharing key";
  email.from = 'info@tryshuttle.com';
  email.text = shareKey;
  email.html = shareKey;

  email.addFilter('templates', 'enable', 1);
  email.addFilter('templates', 'template_id', 'bf638d74-cb89-4627-9fa5-04a2f2d87126');

  sender.send(email, function(err, json) {
    if (err) {
      console.error('Emailer error: ' + err);
    }
    console.log('Emailer response: ' + JSON.stringify(json));
  });
}

module.exports = {
  send: send
};
