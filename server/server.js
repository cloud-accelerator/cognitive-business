'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
var request = require('request');
var bodyParser = require('body-parser');
const demoUser = 'f03c8610-3598-430a-ad6e-b449b680cb93';
var auth = require('./boot/msauth');

var app = module.exports = loopback();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))


app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};


app.post('/outlook-subscription', function(req, res, next) {
  if (req.query && req.query.validationToken) {
    res.send(req.query.validationToken);
  } else if (req.body) {

    auth.getAccessToken().then(function(token) {
      for (var i = 0; i < req.body.value.length; i++) {
        var message = req.body.value[i];
        var resourceData = message.resourceData;
        console.log(resourceData.id);
        request.get({
          url: 'https://graph.microsoft.com/v1.0/users/' + demoUser + '/messages/' + resourceData.id,
          headers: {
            'content-type': 'application/json',
            authorization: 'Bearer ' + token,
            'Prefer': 'outlook.body-content-type=' + '\"' + 'text' + '\"'
          }
        }, function (err, response, body) {
          console.log(err);
          var email = JSON.parse(response.body);
          console.log(email);
          var returnBody = {
            subject: email.subject.replace(/n(\r\n)+/g, ' ').replace(/\r+/g, ' ').replace(/\n+/g, ' '),
            text: email.body.content.replace(/n(\r\n)+/g, ' ').replace(/\r+/g, ' ').replace(/\n+/g, ' '),
            from: email.sender.emailAddress.address,
            to: email.toRecipients[0].emailAddress.address,
            messageID: email.id
          };
          request.post({
            url: 'https://service.us.apiconnect.ibmcloud.com/gws/apigateway/api/a1b20f9ed73ead3ccbc59b82f39dc293f3679a2e03d78386c7ded4d62fcd0002/cognitive-business/provide-email-to-nlu-to-bpm',
            body: returnBody,
            json: true
          }, function(err, response, body) {
            console.log(err);
            var body = { };
            res.status(200).send(body);
          });
        });
      }
    }, function(error) {
      console.error('>>> Error getting access token: ' + error);
    });
  }
});

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
