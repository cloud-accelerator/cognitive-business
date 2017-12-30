'use strict';
var request = require('request');
//var multer = require('multer');
//var upload = multer({ dest: "path" });

module.exports = function(app, cb) {
  /*
   * The `app` object provides access to a variety of LoopBack resources such as
   * models (e.g. `app.models.YourModelName`) or data sources (e.g.
   * `app.datasources.YourDataSource`). See
   * http://docs.strongloop.com/display/public/LB/Working+with+LoopBack+objects
   * for more info.
   */
  /*
    app.post('/email-parser', upload.any(), function(req, res, next) {
        var from = req.body.from;
        var to = req.body.to;
        var text = req.body.text.replace(/(\r\n)+/g,' ').replace(/\r+/g,' ').replace(/\n+/g,' ');
        var subject = req.body.subject.replace(/(\r\n)+/g,' ').replace(/\r+/g,' ').replace(/\n+/g,' ');
        var num_attachments = req.body.attachments;
        var original = req.body;

        for (i = 1; i <= num_attachments; i++) {
          var attachment = req.files['attachment' + i];
        }

        var payload = {
          to: to,
          from: from,
          subject: subject,
          text: text,
          attachments: num_attachments,
          original: original,
          req: req
        };
        console.log(original);
        // https://service.us.apiconnect.ibmcloud.com/gws/apigateway/api/a1b20f9ed73ead3ccbc59b82f39dc293f3679a2e03d78386c7ded4d62fcd0002/cognitive-business
        // https://service.us.apiconnect.ibmcloud.com/gws/apigateway/api/a1b20f9ed73ead3ccbc59b82f39dc293f3679a2e03d78386c7ded4d62fcd0002/cognitive-business/provide-exemail-to-nlu-to-bpm
        request({
          url: 'https://service.us.apiconnect.ibmcloud.com/gws/apigateway/api/a1b20f9ed73ead3ccbc59b82f39dc293f3679a2e03d78386c7ded4d62fcd0002/cognitive-business/provide-email-to-nlu-to-bpm',
          method: 'POST',
          json: true,
          body: payload
        }, function (error, response, body) {
          if (error) {
            res.sendStatus(500);
          } else {
            res.sendStatus(200);
          }
        });

    res.send('200');
    });*/
  cb(null, 'Sender says ');
};
