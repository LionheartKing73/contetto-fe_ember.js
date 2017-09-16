/*jshint node:true*/
module.exports = function(app) {
  var express = require('express');
  var invoiceStatusesRouter = express.Router();
  var response = [];
  ["Void", "Paid", "Unpaid"].forEach(function(item, index){
    response.push({
      type: 'invoiceStatuses',
      id: index+1,
      attributes: {
        name: item
      }
    })
  });
  invoiceStatusesRouter.get('/', function(req, res) {
    res.send({
      'data': response
    });
  });

  invoiceStatusesRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  invoiceStatusesRouter.get('/:id', function(req, res) {
    res.send({
      'data': response[req.params.id-1]
    });
  });

  invoiceStatusesRouter.put('/:id', function(req, res) {
    res.send({
      'invoice-statuses': {
        id: req.params.id
      }
    });
  });

  invoiceStatusesRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/invoice-statuses', require('body-parser').json());
  app.use('/api/invoiceStatuses', invoiceStatusesRouter);
};
