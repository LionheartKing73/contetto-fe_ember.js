/*jshint node:true*/
module.exports = function(app) {
  var express = require('express');
  var addonTypesRouter = express.Router();
  var response = [];
  ["SocialAccount", "Brand", "BrandMember", "Posts", "Storage"].forEach(function(item, index){
    response.push({
      type: 'addonTypes',
      id: index+1,
      attributes: {
        name: item
      }
    })
  });

  addonTypesRouter.get('/', function(req, res) {
    res.send({
      'data': response
    });
  });

  addonTypesRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  addonTypesRouter.get('/:id', function(req, res) {
    res.send({
      'data': response[req.params.id-1]
    });
  });

  addonTypesRouter.put('/:id', function(req, res) {
    res.send({
      'addon-types': {
        id: req.params.id
      }
    });
  });

  addonTypesRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/addon-types', require('body-parser').json());
  app.use('/api/addonTypes', addonTypesRouter);
};
