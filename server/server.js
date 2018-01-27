'use strict';

let loopback = require('loopback');
let boot = require('loopback-boot');
let request = require('request').defaults({strictSSL: false});
let bodyParser = require('body-parser');
let auth = require('./msauth');
let config = require('./config.local.js');

let app = module.exports = loopback();

const demoUser = config.office365User;
const urlToNLU = config.urlToNLU;
console.log(demoUser);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    let baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      let explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};


app.post('/outlook-subscription', function(req, res, next) {
  if (req.query && req.query.validationToken) {
    res.send(req.query.validationToken);
  } else if (req.body) {

    auth.getAccessToken().then(function(token) {
      for (let i = 0; i < req.body.value.length; i++) {
        let message = req.body.value[i];
        let resourceData = message.resourceData;
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
          let email = JSON.parse(response.body);
          console.log(email);
          let returnBody = {
            subject: email.subject.replace(/n(\r\n)+/g, ' ').replace(/\r+/g, ' ').replace(/\n+/g, ' '),
            text: email.body.content.replace(/n(\r\n)+/g, ' ').replace(/\r+/g, ' ').replace(/\n+/g, ' '),
            from: email.sender.emailAddress.address,
            to: email.toRecipients[0].emailAddress.address,
            messageID: email.id
          };
          request.post({
            url: urlToNLU,
            body: returnBody,
            json: true
          }, function(err, response, body) {
            console.log(err);
            body = { };
            res.status(200).send(body);
          });
        });
      }
    }, function(error) {
      console.error('>>> Error getting access token: ' + error);
    });
  }
});

app.post('/bpm', function(req, res, next) {

  auth.getAccessToken().then(function(token) {
    for (let i = 0; i < req.body.value.length; i++) {
      let message = req.body.value[i];
      let resourceData = message.resourceData;
      console.log(resourceData.id);
      request.get({
        url: 'https://graph.microsoft.com/v1.0/users/' + demoUser + '/messages',
        headers: {
          'content-type': 'application/json',
          authorization: 'Bearer ' + token,
          'Prefer': 'outlook.body-content-type=' + '\"' + 'text' + '\"'
        }
      }, function (err, response, body) {

});


// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
