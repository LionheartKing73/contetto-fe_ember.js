import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import {
  belongsTo
}
from 'ember-data/relationships';

export default Model.extend({
  firstName: attr('string'),
  lastName: attr('string'),
  zip: attr('string'),
  address: attr('string'),
  country: belongsTo('location'),
  province: belongsTo('location'),
  city: attr('string'),

  cardNumber: attr('string'),
  expDate: attr('string'),
  ccv2cvc2: attr('string'),
  createdDate: attr('utc-date'),
  createdAt: Ember.computed('createdDate', function(){
    if(this.get('createdDate')){
      return moment(this.get('createdDate')).format('MMMM Do YYYY, h:mm:ss a');
    }
    else{
      return "";
    }
  }),

  user: belongsTo('user')
});
