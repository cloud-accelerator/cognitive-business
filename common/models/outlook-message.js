'use strict';

var auth = require('./msauth');
var request = require('request');
const demoUser = 'f03c8610-3598-430a-ad6e-b449b680cb93';
const inProgressID = 'AAMkADQ1MTkwZTZmLTM4YjItNDdhMy1iYTA4LTVhNTgxMjNjZDk3MQAuAAAAAABb--bRI-yrTKkcCPmkdRVRAQAo4Gheq6DvQJCeRfV5YOb9AAAFxZoXAAA=';
const inReview =  'AAMkADQ1MTkwZTZmLTM4YjItNDdhMy1iYTA4LTVhNTgxMjNjZDk3MQAuAAAAAABb--bRI-yrTKkcCPmkdRVRAQAo4Gheq6DvQJCeRfV5YOb9AAAFxZoZAAA=';
const completed = 'AAMkADQ1MTkwZTZmLTM4YjItNDdhMy1iYTA4LTVhNTgxMjNjZDk3MQAuAAAAAABb--bRI-yrTKkcCPmkdRVRAQAo4Gheq6DvQJCeRfV5YOb9AAAFxZoYAAA=';

module.exports = function(Outlookmessage) {
  Outlookmessage.moveEmailToInProgress = function(msg, cb) {
    auth.getAccessToken().then(function(token) {
      moveMessageTo(token, msg, cb, inProgressID);
    }, function(error) {
      console.error('>>> Error getting access token: ' + error);
      cb(null, error);
    });
  };
  Outlookmessage.MoveEmailToInReview = function(msg, cb) {
    auth.getAccessToken().then(function(token) {
      moveMessageTo(token, msg, cb, inReview);
    }, function(error) {
      console.error('>>> Error getting access token: ' + error);
      cb(null, error);
    });
  };
  Outlookmessage.MoveEmailToCompleted = function(msg, cb) {
    auth.getAccessToken().then(function(token) {
      moveMessageTo(token, msg, cb, completed);
    }, function(error) {
      console.error('>>> Error getting access token: ' + error);
      cb(null, error);
    });
  };
  Outlookmessage.FindMessageIDForSubject = function(msg, cb) {
    auth.getAccessToken().then(function(token) {
      findMessageID(token, msg, cb);
    }, function(error) {
      console.error('>>> Error getting access token: ' + error);
      cb(null, error);
    });
  };
};


var findMessageID = function(token, subject, cb) {
  var body = {
  };
  console.log('https://graph.microsoft.com/v1.0/users/' + demoUser + '/mailFolders/Inbox/messages?$filter=subject eq \'' + subject +  '\'');
  request.get({
    url: 'https://graph.microsoft.com/v1.0/users/' + demoUser + '/mailFolders/Inbox/messages?$filter=subject eq \'' + subject +  '\'',
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
        returnBody = {
          'messageID' : parsedBody.value[0].id
        };
        cb(null, returnBody);
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


var moveMessageTo = function(token, messageId, cb, folder) {

  var body = {
    'DestinationId': folder
  };

  request.post({
    url: 'https://graph.microsoft.com/v1.0/users/' + demoUser + '/messages/' + messageId + '/move',
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
      } else if (parsedBody.id) {
        console.log('>>> Successfully moved to in progess');
        returnBody = {
          'messageID' : parsedBody.id
        };
        cb(null, returnBody);
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
