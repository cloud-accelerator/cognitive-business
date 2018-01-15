'use strict';
var auth = require('./msauth');
var request = require('request');

const demoUser = 'f03c8610-3598-430a-ad6e-b449b680cb93';
const siteID = 'cloudaccelerator.sharepoint.com,2edc05d8-c30f-40ee-b9b4-f7d91fad37ff,21c44fc7-fd1b-4961-8da4-cb0d19517697';
const listID = 'b09d2e9e-d0d1-4493-9fa4-2748df0109d1';

module.exports = function(WKSSharepoint) {
  WKSSharepoint.AddToSharepoint = function(to,
                                           from,
                                           subject,
                                           nbnApptStart,
                                           nbnApptEnd,
                                           telstraApptStart,
                                           telstraApptEnd,
                                           referenceID,
                                           message,
                                           nbnInvoiceNumber,
                                           nbnBroadbandNumber,
                                           emailTypeIndicator,
                                           emailType,
                                           address,
                                           suburb,
                                           state,
                                           postcode,
                                           caseMgrEmail,
                                           caseMgrName,
                                           aaaRecipient,
                                           prerequisite,
                                           details,
                                           customerName,
                                           technologyType,
                                           actionRequired,
                                           cb) {
    auth.getAccessToken().then(function(token) {
      addToSharePoint(token,
        to,
        from,
        subject,
        nbnApptStart,
        nbnApptEnd,
        telstraApptStart,
        telstraApptEnd,
        referenceID,
        message,
        nbnInvoiceNumber,
        nbnBroadbandNumber,
        emailTypeIndicator,
        emailType,
        address,
        suburb,
        state,
        postcode,
        caseMgrEmail,
        caseMgrName,
        aaaRecipient,
        prerequisite,
        details,
        customerName,
        technologyType,
        actionRequired,
        cb);
    }, function(error) {
      console.error('>>> Error getting access token: ' + error);
      cb(null, error);
    });
  };
};


var addToSharePoint = function(token,
                               to,
                               from,
                               subject,
                               nbnApptStart,
                               nbnApptEnd,
                               telstraApptStart,
                               telstraApptEnd,
                               referenceID,
                               message,
                               nbnInvoiceNumber,
                               nbnBroadbandNumber,
                               emailTypeIndicator,
                               emailType,
                               address,
                               suburb,
                               state,
                               postcode,
                               caseMgrEmail,
                               caseMgrName,
                               aaaRecipient,
                               prerequisite,
                               details,
                               customerName,
                               technologyType,
                               actionRequired,
                               cb) {


  var body = {
    'fields': {
      'To': to,
      'From': from,
      'Subject': subject,
      'NBNApptStart': nbnApptStart,
      'NBNApptEnd': nbnApptEnd,
      'TelstraApptStart': telstraApptStart,
      'TelstraApptEnd': telstraApptEnd,
      'ReferenceID': referenceID,
      'Message': message,
      'NBNInvoiceNumber': nbnInvoiceNumber,
      'NBNBroadbandNumber': nbnBroadbandNumber,
      'EmailTypeIndicator': emailTypeIndicator,
      'EmailType': emailType,
      'Address': address,
      'Suburb': suburb,
      'State': state,
      'Postcode': postcode,
      'CaseMgrEmail': caseMgrEmail,
      'CaseMgrName': caseMgrName,
      'AAARecipient': aaaRecipient,
      'Prerequisite': prerequisite,
      'Details': details,
      'CustomerName': customerName,
      'TechnologyType': technologyType,
      'ActionRequired': actionRequired
    }
  };

  request.post({
    url: 'https://graph.microsoft.com/v1.0' + '/sites/' + siteID + '/lists/' + listID + '/items',
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
      console.log(parsedBody);
      if (parsedBody.error) {
        console.log(parsedBody.error);
        var error = new Error(parsedBody.error.code);
        error.status = 400;
        cb(error);
      } else {
        console.log('>>> Successfully loaded to sharepoint');
        cb(null, parsedBody);
      }
    } else {
      var error = new Error('Not found');
      error.status = 400;
      cb(error);
    }
  });
};
