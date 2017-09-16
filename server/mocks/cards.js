/*jshint node:true*/
module.exports = function(app) {
  var express = require('express');
  var cardsRouter = express.Router();
  var response = {
    data: {
      type: 'cards',
      id: 1,
      attributes: {
        firstName: "Karan",
        lastName: "Batta",
        zip: "151203",
        address: "#44, Medical Campus",
        city: "Faridkot",
        cardNumber: 123456781234567,
        expDate: "0321",
        ccv2cvc2: 123
      },
      relationships: {
        country: {
          data: {
            type: 'locations',
            id: 2124
          }
        },
        state: {
          data: {
            type: 'locations',
            id: 20121
          }
        },
        user: {
          data: {
            type: 'users',
            id: '5938b9160f8f5400012db77f'
          }
        }
      }
    }
  }

  cardsRouter.get('/', function(req, res) {
    res.send({
      'data': [response.data]
    });
  });

  cardsRouter.post('/', function(req, res) {
    res.send(response);
    // res.status(201).end();
  });

  cardsRouter.get('/:id', function(req, res) {
    res.send(response);
  });

  cardsRouter.put('/:id', function(req, res) {
    res.send(response);
  });

  cardsRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/cards', require('body-parser').json());
  app.use('/api/cards', cardsRouter);
};
