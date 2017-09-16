/*jshint node:true*/
module.exports = function(app) {
  var express = require('express');
  var addonItemsRouter = express.Router();
  var response = [];
  var c = 0;
  for(var i=1;i<6;i++){
    for(var j=i; j>0; j--){
      c+=1;
      var resp = {
        type: 'addonItems',
        id: c,
        attributes: {
          startDate: new Date(),
        },
        relationships: {
          addon: {
            data: {
              type: 'addons',
              id: i
            }
          }
        }
      }
      response.push(resp);
    }
  }

  addonItemsRouter.get('/', function(req, res) {
    res.send({
      'data': response
    });
  });

  addonItemsRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  addonItemsRouter.get('/:id', function(req, res) {
    res.send({
      'data': response[parseInt(req.params.id)-1]
    });
  });

  addonItemsRouter.put('/:id', function(req, res) {
    res.send({
      'addon-items': {
        id: req.params.id
      }
    });
  });

  addonItemsRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/addon-items', require('body-parser').json());
  app.use('/api/addonItems', addonItemsRouter);
};
