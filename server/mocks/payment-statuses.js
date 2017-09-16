/*jshint node:true*/
module.exports = function(app) {
  var express = require('express');
  var paymentStatusesRouter = express.Router();
  var response = [];
  ["Pending", "Failed", "Complete", "Refunded"].forEach(function(item, index){
    response.push({
      type: 'paymentStatuses',
      id: index+1,
      attributes: {
        name: item
      }
    })
  });

  paymentStatusesRouter.get('/', function(req, res) {
    res.send({
      'data': response
    });
  });

  paymentStatusesRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  paymentStatusesRouter.get('/:id', function(req, res) {
    res.send({
      'data': response[req.params.id-1]
    });
  });

  paymentStatusesRouter.put('/:id', function(req, res) {
    res.send({
      'payment-statuses': {
        id: req.params.id
      }
    });
  });

  paymentStatusesRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/payment-statuses', require('body-parser').json());
  app.use('/api/paymentStatuses', paymentStatusesRouter);
};
