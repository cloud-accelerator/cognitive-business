'use strict';

let request = require('request');
let Q = require('q');
let config = require('./config.local.js');

// The auth module object.
let msauth = {};

// @name getAccessToken
// @desc Makes a request for a token using client credentials.
msauth.getAccessToken = function () {
  let deferred = Q.defer();

  // These are the parameters necessary for the OAuth 2.0 Client Credentials Grant Flow.
  // For more information, see Service to Service Calls Using Client Credentials (https://msdn.microsoft.com/library/azure/dn645543.aspx).
  let requestParams = {
    grant_type: 'client_credentials',
    client_id: config.azureClientId,
    client_secret: config.azureClientSecret,
    resource: 'https://graph.microsoft.com'
  };
  // Make a request to the token issuing endpoint.
  request.post({url: config.azureTokenEndpoint, form: requestParams}, function(err, response, body) {
    let parsedBody = JSON.parse(body);
    if (err) {
      deferred.reject(err);
    } else if (parsedBody.error) {
      deferred.reject(parsedBody.error_description);
    } else {
      // If successful, return the access token.
      deferred.resolve(parsedBody.access_token);
    }
  });

  return deferred.promise;
};

module.exports = msauth;
