import {
  validatePresence
}
from 'ember-changeset-validations/validators';

export default {
  name: validatePresence({
    presence: true,
    message: 'Name is required!'
  }),
  description: validatePresence({
    presence: true,
    message: 'Description is required!'
  }),
  primaryTA: validatePresence({
    presence: true,
    message: 'Primary Target Audience is required!'
  }),
  priceAssessment: validatePresence({
    presence: true,
    message: 'Price assessment is required!'
  }),
  type: validatePresence({
    presence: true,
    message: 'Product type is required!'
  }),
  deliveries: validatePresence({
    presence: true,
    message: 'Deliveries is required!'
  }),
  shippingRegions: function(key, value, _, changes, content) {
    var deliveries = changes.hasOwnProperty('deliveries') ? changes['deliveries'] : content.get('deliveries');

    if (deliveries.mapBy('name').includes("Shipped") && Ember.isEmpty(value)) {
      return "Shipping regions is required!";
    }

    return true;
  },
  groups: validatePresence({
    presence: true,
    message: 'Product group is required!'
  })
};
