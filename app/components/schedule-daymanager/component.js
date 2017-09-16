import Ember from 'ember';

const {
  Component,
  get,
  set,
  inject: { service }
} = Ember;

export default Ember.Component.extend({
 
timeSort:['sortOn:asc'],
sortedTimes: Ember.computed.sort('times', 'timeSort'),
    
  store: Ember.inject.service('store'),
  init: function() {
     
     return this._super();  
  } 
  }); 
 