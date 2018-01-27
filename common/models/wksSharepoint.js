'use strict';
let auth = require('../../server/msauth');
let request = require('request');

let config = require('../../server/config.local.js');
const siteID = config.sharepointSite;
const listID = config.sharepointList;

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


let addToSharePoint = function(token,
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
  let body = {
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
    let parsedBody;
    let returnBody = {};
    if (err) {
      console.error('>>> Application error: ' + err);
      cb(err);
    } else if (body) {
      parsedBody = JSON.parse(body);
      console.log(parsedBody);
      if (parsedBody.error) {
        console.log(parsedBody.error);
        let error = new Error(parsedBody.error.code);
        error.status = 400;
        cb(error);
      } else {
        console.log('>>> Successfully loaded to sharepoint');
        cb(null, parsedBody);
      }
    } else {
      let error = new Error('Not found');
      error.status = 400;
      cb(error);
    }
  });
};
