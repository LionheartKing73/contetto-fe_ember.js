/*jshint node:true*/
module.exports = function(app) {
  var express = require('express');
  var lineItemsRouter = express.Router();
  var response = [{
        type: 'lineItems',
        id: 1,
        attributes: {
          quantity: 1,
          factor: 1,
          itemId: "6cd6206fd06d4874a8bcc0f4eb14aa25",
          itemType: "plan"
        },
        relationships: {
          invoice: {
            data: {
              type: 'invoices',
              id: "1"
            }
          }
        }
      },
      {
        type: 'lineItems',
        id: 2,
        attributes: {
          quantity: 2,
          factor: 1,
          itemId: "1",
          itemType: "addon"
        },
        relationships: {
          invoice: {
            data: {
              type: 'invoices',
              id: "1"
            }
          }
        }
      },
      {
        type: 'lineItems',
        id: 3,
        attributes: {
          quantity: 4,
          factor: 1,
          itemId: "2",
          itemType: "addon"
        },
        relationships: {
          invoice: {
            data: {
              type: 'invoices',
              id: "1"
            }
          }
        }
      }
    ]

  lineItemsRouter.get('/', function(req, res) {
    res.send({'data': response});
  });

  lineItemsRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  lineItemsRouter.get('/:id', function(req, res) {
    var resp;
    response.forEach((r)=>{
      if(r.id==req.params.id){
        resp=r;
        return;
      }
    })
    res.send({
      'data': resp
    });
  });

  lineItemsRouter.put('/:id', function(req, res) {
    res.send({
      'line-items': {
        id: req.params.id
      }
    });
  });

  lineItemsRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/line-items', require('body-parser').json());
  app.use('/api/lineItems', lineItemsRouter);
};
