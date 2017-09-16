/*jshint node:true*/
module.exports = function(app) {
  var express = require('express');
  var invoicesRouter = express.Router();
  var response = {
    data: {
      type: 'invoices',
      id: 1,
      attributes: {
        date: new Date(),
      },
      relationships: {
        lineItems: {
          data: [{
            type: 'lineItems',
            id: "1"
          },
          {
            type: 'lineItems',
            id: "2"
          },
          {
            type: 'lineItems',
            id: "3"
          }]
        },
        payments: {
          data: [{
            type: 'payments',
            id: "1"
          },
          {
            type: 'payments',
            id: "2"
          }]
        },
        invoiceStatus: {
          data: {
            type: 'invoiceStatuses',
            id: "3"
          }
        }
      }
    }
  }

  invoicesRouter.get('/', function(req, res) {
    res.send({data: [response]});
  });

  invoicesRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  invoicesRouter.get('/:id', function(req, res) {
    res.send(response);
  });

  invoicesRouter.put('/:id', function(req, res) {
    res.send({
      'invoices': {
        id: req.params.id
      }
    });
  });

  invoicesRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/invoices', require('body-parser').json());
  app.use('/api/invoices', invoicesRouter);
};
