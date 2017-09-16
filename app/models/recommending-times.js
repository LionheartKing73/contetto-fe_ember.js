import DS from "ember-data";
import Ember from "ember";
const {attr, belongsTo, hasMany} = DS;

export default DS.Model.extend({
    dateTime:attr('string'),
    networkType:belongsTo('networkType',{inverse:null}),
    socialAccount:belongsTo('socialAccount',{inverse:null})
  
});
