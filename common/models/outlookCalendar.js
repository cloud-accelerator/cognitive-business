'use strict';

var auth = require('./msauth');
var request = require('request');
var moment = require('moment');
const calendarID = 'AAMkADQ1MTkwZTZmLTM4YjItNDdhMy1iYTA4LTVhNTgxMjNjZDk3MQBGAAAAAABb--bRI-yrTKkcCPmkdRVRBwAo4Gheq6DvQJCeRfV5YOb9AAAAAAEGAAAo4Gheq6DvQJCeRfV5YOb9AAAFxa3dAAA=';
const demoUser = 'f03c8610-3598-430a-ad6e-b449b680cb93';


module.exports = function(OutlookCalendar) {
  OutlookCalendar.RemoveConflictingEvents = function(startTime,
                                                     endTime,
                                                     timeZone,
                                                     cb) {
    auth.getAccessToken().then(function(token) {
      removeConflictingEvent(token,
        startTime,
        endTime,
        timeZone,
        cb);
    }, function(error) {
      console.error('>>> Error getting access token: ' + error);
      cb(null, error);
    });
  };

  OutlookCalendar.IsConflict = function(startTime,
                                        endTime,
                                        timeZone,
                                        cb)  {
    auth.getAccessToken().then(function(token) {
      isConflict(token,
        startTime,
        endTime,
        timeZone,
        cb);
    }, function(error) {
      console.error('>>> Error getting access token: ' + error);
      cb(null, error);
    });
  };

  OutlookCalendar.AddEvent = function(startTime,
                                      endTime,
                                      subject,
                                      timeZone,
                                      cb)  {
    auth.getAccessToken().then(function(token) {
      addEvent(token,
        startTime,
        endTime,
        timeZone,
        subject,
        cb);
    }, function(error) {
      console.error('>>> Error getting access token: ' + error);
      cb(null, error);
    });
  };

  var removeConflictingEvent = function(token,
                                        startTime,
                                        endTime,
                                        timeZone,
                                        cb) {
    var body = {
      'DestinationId': folder
    };


  };

  var isConflict = function(token,
                            startTime,
                            endTime,
                            timeZone,
                            cb) {


    var body = {
    };
    console.log('outlook.timezone=' + '\"' + timeZone + '\"');
    request.get({
      url: 'https://graph.microsoft.com/v1.0/users/' + demoUser + '/calendars/' + calendarID + '/events?$select=start,end',
      headers: {
        'content-type': 'application/json',
        authorization: 'Bearer ' + token,
        'Prefer': 'outlook.timezone=' + '\"' + timeZone + '\"'
      },
      body: JSON.stringify(body)
    }, function(err, response, body) {
      var returnBody = {};
      if (err) {
        console.error('>>> Application error: ' + err);
        cb(err);
      } else if (body) {
        var parsedBody = JSON.parse(body);
        if (parsedBody.error) {
          console.log(parsedBody.error);
          var error = new Error(parsedBody.error.code);
          error.status = 400;
          cb(error);
        } else {
          console.log('>>> Successfully added events');
          var values = parsedBody.value;

          var isConflict = false;

          var startBoundary = new Date(startTime);
          var endBoundary = new Date(endTime);

          for (var i = 0; i < values.length; i++) {
            var id = values[i].id;
            var start = new Date(values[i].start.dateTime);
            var end = new Date(values[i].end.dateTime);

            var startInBoundary = startBoundary.getTime() >= start.getTime() && endBoundary.getTime() < start.getTime();
            var endInBoundary = startBoundary.getTime() < end.getTime() && endBoundary.getTime() >= end.getTime();

            console.log(start);
            console.log(end);
            console.log(startBoundary);
            console.log(endBoundary);

            if (startInBoundary || endInBoundary) {
              isConflict = true;
              break;
            }
          }
          returnBody = {
            'isConflict' : isConflict
          };
          cb(null, returnBody);
        }

      }
    });
  };



  var addEvent = function(token,
                          startTime,
                          endTime,
                          timeZone,
                          subject,
                          cb) {
    var body = {
      'subject': subject,
      'start': {
        'dateTime': convertTime(startTime),
        'timeZone': timeZone
      },
      'end': {
        'dateTime': convertTime(endTime),
        'timeZone': timeZone
      }
    };

    request.post({
      url: 'https://graph.microsoft.com/v1.0/users/' + demoUser + '/calendars/' + calendarID + '/events',
      headers: {
        'content-type': 'application/json',
        authorization: 'Bearer ' + token
      },
      body: JSON.stringify(body)
    }, function(err, response, body) {
      console.log(body);
      var returnBody = {};
      if (err) {
        console.error('>>> Application error: ' + err);
        cb(err);
      } else if (body) {
        var parsedBody = JSON.parse(body);
        if (parsedBody.error) {
          console.log(parsedBody.error);
          var error = new Error(parsedBody.error.code);
          error.status = 400;
          cb(error);
        } else {
          console.log('>>> Successfully added events');
          returnBody = {};
          cb(null, returnBody);
        }
      }
    });
  };

  //dd-mm-hh hh:mm:ss
  var convertTime = function(timeString) {
    return moment(timeString, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DDTHH:mm:ss');
  };
};
