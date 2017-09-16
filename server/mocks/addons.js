/*jshint node:true*/
module.exports = function(app) {
  var express = require('express');
  var addonsRouter = express.Router();
  var response = [];
  for(var i=1;i<6;i++){
    var resp = {
      type: 'addons',
      id: i,
      attributes: {
        amount: 1,
        price: i+1,
      },
      relationships: {
        addonType: {
          data: {
            type: 'addonTypes',
            id: i
          }
        }
      }
    }
    response.push(resp);
  }
  addonsRouter.get('/', function(req, res) {
    res.send({
      'data': response
    });
  });

  addonsRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  addonsRouter.get('/:id', function(req, res) {
    res.send({
      'data': response[parseInt(req.params.id)-1]
    });
  });

  addonsRouter.put('/:id', function(req, res) {
    res.send({
      'addons': {
        id: req.params.id
      }
    });
  });

  addonsRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/addons', require('body-parser').json());
  app.use('/api/addons', addonsRouter);
};
