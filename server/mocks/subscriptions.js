/*jshint node:true*/
module.exports = function(app) {
  var express = require('express');
  var subscriptionsRouter = express.Router();
  var addItems = [];
  for(var i=1;i<=15; i++){
    var a = {
      type: "addons",
      id: i
    }
    addItems.push(a);
  }
  var response = {
    data: {
      type: 'subscriptions',
      id: 1,
      attributes: {
        startDate: new Date(),
      },
      relationships: {
        company: {
          data: {
            type: 'companies',
            id: "594e8cc0b2a75d000154b71f"
          }
        },
        plan: {
          data: {
            type: 'plans',
            id: "52e31e6b9f13456baf87e6ad1f42ab9f"
          }
        },
        card: {
          data: {
            type: 'cards',
            id: '1'
          }
        },
        addonItems: {
          data: addItems
        }
      }
    }
  }
  subscriptionsRouter.get('/', function(req, res) {
    res.send({
      'subscriptions': []
    });
  });

  subscriptionsRouter.post('/', function(req, res) {
    res.send(response);
  });

  subscriptionsRouter.get('/:id', function(req, res) {
    res.send(response);
  });

  subscriptionsRouter.put('/:id', function(req, res) {
    res.send(response);
  });

  subscriptionsRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/subscriptions', require('body-parser').json());
  app.use('/api/subscriptions', subscriptionsRouter);
};
