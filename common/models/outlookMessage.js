'use strict';

let auth = require('../../server/msauth');
let request = require('request');

let config = require('../../server/config.local.js');

const demoUser = config.office365User;
const inProgressID = config.outlookInProgressFolder;
const inReview = config.outlookInReviewFolder;
const completed = config.outlookCompletedFolder;

module.exports = function(OutlookMessage) {
  OutlookMessage.MoveEmailToInProgress = function(msg, cb) {
    auth.getAccessToken().then(function(token) {
      moveMessageTo(token, msg, cb, inProgressID);
    }, function(error) {
      console.error('>>> Error getting access token: ' + error);
      cb(null, error);
    });
  };
  OutlookMessage.MoveEmailToInReview = function(msg, cb) {
    auth.getAccessToken().then(function(token) {
      moveMessageTo(token, msg, cb, inReview);
    }, function(error) {
      console.error('>>> Error getting access token: ' + error);
      cb(null, error);
    });
  };
  OutlookMessage.MoveEmailToCompleted = function(msg, cb) {
    auth.getAccessToken().then(function(token) {
      moveMessageTo(token, msg, cb, completed);
    }, function(error) {
      console.error('>>> Error getting access token: ' + error);
      cb(null, error);
    });
  };
  OutlookMessage.FindMessageIDForSubject = function(msg, cb) {
    auth.getAccessToken().then(function(token) {
      findMessageID(token, msg, cb);
    }, function(error) {
      console.error('>>> Error getting access token: ' + error);
      cb(null, error);
    });
  };
};


let findMessageID = function(token, message, cb) {
  let body = {
  };

  request.get({
    url: 'https://graph.microsoft.com/v1.0/users/' + demoUser + '/mailFolders/Inbox/messages?$filter=subject eq \'' + message +  '\'',
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
      if (parsedBody.error) {
        console.log(parsedBody.error);
        let error = new Error(parsedBody.error.code);
        error.status = 400;
        cb(error);
      } else if (parsedBody.value.length > 0) {
        console.log('>>> Successfully moved to in progess');
        returnBody = {
          'messageID' : parsedBody.value[0].id
        };
        cb(null, returnBody);
      } else {
        let error = new Error('Not found');
        error.status = 400;
        cb(error);
      }
    } else {
      let error = new Error('Not found');
      error.status = 400;
      cb(error);
    }
  });
};


let moveMessageTo = function(token, message, cb, folder) {

  let body = {
    'DestinationId': folder
  };

  request.post({
    url: 'https://graph.microsoft.com/v1.0/users/' + demoUser + '/messages/' + message + '/move',
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
      if (parsedBody.error) {
        console.log(parsedBody.error);
        let error = new Error(parsedBody.error.code);
        error.status = 400;
        cb(error);
      } else if (parsedBody.id) {
        console.log('>>> Successfully moved to in progess');
        returnBody = {
          'messageID' : parsedBody.id
        };
        cb(null, returnBody);
      } else {
        let error = new Error('Not found');
        error.status = 400;
        cb(error);
      }
    } else {
      let error = new Error('Not found');
      error.status = 400;
      cb(error);
    }
  });
};
