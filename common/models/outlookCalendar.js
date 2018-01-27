'use strict';

let auth = require('../../server/msauth');
let request = require('request');
let moment = require('moment');
let config = require('../../server/config.local.js');

const calendarID = config.office365Calendar;
const demoUser = config.office365User;

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

  let removeConflictingEvent = function(token,
                                        startTime,
                                        endTime,
                                        timeZone,
                                        cb) {
    let body = {
      'DestinationId': folder
    };
  };

  let isConflict = function(token,
                            startTime,
                            endTime,
                            timeZone,
                            cb) {


    let body = {
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
      let returnBody = {};
      if (err) {
        console.error('>>> Application error: ' + err);
        cb(err);
      } else if (body) {
        let parsedBody = JSON.parse(body);
        if (parsedBody.error) {
          console.log(parsedBody.error);
          let error = new Error(parsedBody.error.code);
          error.status = 400;
          cb(error);
        } else {
          console.log('>>> Successfully added events');
          let values = parsedBody.value;

          let isConflict = false;

          let startBoundary = new Date(startTime);
          let endBoundary = new Date(endTime);

          for (let i = 0; i < values.length; i++) {
            let id = values[i].id;
            let start = new Date(values[i].start.dateTime);
            let end = new Date(values[i].end.dateTime);

            let startInBoundary = startBoundary.getTime() >= start.getTime() && endBoundary.getTime() < start.getTime();
            let endInBoundary = startBoundary.getTime() < end.getTime() && endBoundary.getTime() >= end.getTime();

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



  let addEvent = function(token,
                          startTime,
                          endTime,
                          timeZone,
                          subject,
                          cb) {
    let body = {
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
      let returnBody = {};
      if (err) {
        console.error('>>> Application error: ' + err);
        cb(err);
      } else if (body) {
        let parsedBody = JSON.parse(body);
        if (parsedBody.error) {
          console.log(parsedBody.error);
          let error = new Error(parsedBody.error.code);
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
  let convertTime = function(timeString) {
    return moment(timeString, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DDTHH:mm:ss');
  };
};
