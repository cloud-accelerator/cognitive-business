'use strict';

var auth = require('./msauth');

module.exports = function(Outlookmessage) {
  Outlookmessage.moveEmailToInProgress = function(msg, cb) {
    auth.getAccessToken().then(function(token) {
      // Get all of the users in the tenant.
      console.log('token obtained');
    }, function(error) {
      console.error('>>> Error getting access token: ' + error);
    });

    cb(null, 'Sender says ' + msg + ' to receiver');
  };
};
