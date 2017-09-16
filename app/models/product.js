import DS from 'ember-data';
import attr from 'ember-data/attr';
import {
  belongsTo,
  hasMany
}
from 'ember-data/relationships';

export default DS.Model.extend({

  brand: belongsTo('brand'),

  name: attr('string'),
  description: attr('string'),

  primaryLandingPage: belongsTo('landingPage', {
    inverse: null
  }),
  landingPages: hasMany('landingPage', {
    inverse: null
  }),


  oneTimePrice: attr('number'),
  oneTimeCurrency: belongsTo('currency'),
  ratePrice: attr('number'),
  rateCurrency: belongsTo('currency'),
  rateFrequency: belongsTo('frequency'),

  subscriptionPrices: hasMany('subscriptionPrice'),

  primaryPhoto: belongsTo('file'),
  photos: hasMany('file'),


  priceAssessment: belongsTo('priceAssessment'),
  type: belongsTo('productType'),
  pricingType: belongsTo('pricingType'),

  primaryTA: belongsTo('audience'),
  targetAudiences: hasMany('audience'),
  shippingRegions: hasMany('location'),
  deliveries: hasMany('productDelivery'),
  groups: hasMany('product-group', {
    inverse: 'products'
  })
});
