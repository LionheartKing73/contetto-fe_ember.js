/*jshint node:true*/
module.exports = function(app) {
  var express = require('express');
  var paymentsRouter = express.Router();
  var response = [{
      type: 'payments',
      id: 1,
      attributes: {
        amount: 100,
        date: new Date(),
        description: "THis is payment"
      },
      relationships: {
        invoice: {
          data: {
            type: 'invoices',
            id: "1"
          }
        },
        paymentStatus: {
          data: {
            type: 'paymentStatuses',
            id: "2"
          }
        },
        card: {
          data: {
            type: 'cards',
            id: "1"
          }
        }
      }
    },
    {
      type: 'payments',
      id: 2,
      attributes: {
        amount: 100,
        date: new Date(),
        description: "THis is payment"
      },
      relationships: {
        invoice: {
          data: {
            type: 'invoices',
            id: "1"
          }
        },
        paymentStatus: {
          data: {
            type: 'paymentStatuses',
            id: "3"
          }
        },
        card: {
          data: {
            type: 'cards',
            id: "1"
          }
        }
      }
    }
  ]

  paymentsRouter.get('/', function(req, res) {
    res.send({'data': response});
  });

  paymentsRouter.post('/', function(req, res) {
    res.send({
      'data': response[1]
    });
  });

  paymentsRouter.get('/:id', function(req, res) {
    var resp;
    response.forEach((r) => {
      if (r.id == req.params.id) {
        resp = r;
        return;
      }
    })
    res.send({
      'data': resp
    });
  });

  paymentsRouter.put('/:id', function(req, res) {
    res.send({
      'data': response[parseInt(req.params.id)-1]
    });
  });

  paymentsRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/payments', require('body-parser').json());
  app.use('/api/payments', paymentsRouter);
};
