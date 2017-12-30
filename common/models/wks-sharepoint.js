'use strict';
var auth = require('./msauth');
var request = require('request');

module.exports = function(WKSSharepoint) {
  WKSSharepoint.AddToSharePoint = function(msg, cb) {
    auth.getAccessToken().then(function(token) {
      addToSharePoint(token, msg, cb);
    }, function(error) {
      console.error('>>> Error getting access token: ' + error);
      cb(null, error);
    });
  };
};


var addToSharePoint = function(token, msg, cb) {
  console.log(msg);
  var body = {
    'fields': {
      'To': msg.To,
      'From': msg.From,
      'Subject': msg.Subject,
      'NBN_ApptDate': msg.NBN_ApptDate,
      'NBN_ApptYear': msg.NBN_ApptYear,
      'NBN_ApptMonth': msg.NBN_ApptMonth,
      'NBN_ApptDay': msg.NBN_ApptDay,
      'Telstra_ApptDate': msg.Telstra_ApptDate,
      'Telstra_ApptYear': msg.Telstra_ApptYear,
      'Telstra_ApptMonth': msg.Telstra_ApptMonth,
      'NBN_Start': msg.NBN_Start,
      'NBN_End': msg.NBN_End,
      'Telstra_Start':  msg.Telstra_Start,
      'Telstra_End': msg.Telstra_End,
      'Reference_ID': msg.Reference_ID,
      'NBNInvoiceNumber': msg.NBNInvoiceNumber,
      'EmailTypeIndicator': msg.EmailTypeIndicator,
      'Address': msg.Address,
      'Suburb': msg.Suburb,
      'Postcode': msg.Postcode,
      'State': msg.State,
      'CaseMgrEmail': msg.CaseMgrEmail
    }
  };
 request.post({
    url: 'https://graph.microsoft.com/v1.0/sites/cloudaccelerator.sharepoint.com,2edc05d8-c30f-40ee-b9b4-f7d91fad37ff,21c44fc7-fd1b-4961-8da4-cb0d19517697/lists',
    headers: {
      'content-type': 'application/json',
      authorization: 'Bearer ' + token
    },
    body: JSON.stringify(body)
  }, function(err, response, body) {
    var parsedBody;
    var returnBody = {};
    if (err) {
      console.error('>>> Application error: ' + err);
      cb(err);
    } else if (body) {
      parsedBody = JSON.parse(body);


      if (parsedBody.error) {
        if (parsedBody.error.code === 'RequestBroker-ParseUri') {
          console.error(
            '>>> Error moving to in progress. Most likely due to this user having a MSA instead of an Office 365 account.'
          );
        } else {
          console.error(
            '>>> Error moving to in progress' + '.' + parsedBody.error.message
          );
        }
        var error = new Error('Could not authenticate');
        error.status = 401;
        cb(error);
      } else if (parsedBody.value.length > 0) {
        console.log('>>> Successfully moved to in progess');

        cb(null, {});
      } else {
        var error = new Error('Not found');
        error.status = 400;
        cb(error);
      }
    } else {
      var error = new Error('Not found');
      error.status = 400;
      cb(error);
    }
  });
};
