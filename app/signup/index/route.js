import Ember from 'ember';

const {
  Route
} = Ember;

export default Route.extend({
  queryParams: {
    email: {
      refreshModel: true
    }
  },
  model(params) {
    return params;
  },
  redirect: function(model, transition) {
    // You need the `null` here (don't use `undefined`)
    // Ember will check the number of models you pass in
    if (model.email) {
      this.transitionTo('signup.email', model.email, {
        queryParams: transition.queryParams
      });
    }
    else {
      this.transitionTo('signup.email', "you@example.com", {
        queryParams: transition.queryParams
      });
    }
  }
});
