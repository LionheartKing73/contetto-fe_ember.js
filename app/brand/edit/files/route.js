import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    refresh: {
      refreshModel: true
    }
  },
  model(params){
    return params;
  }
});
