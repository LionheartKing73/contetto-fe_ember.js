import Ember from 'ember';

const {
  Route,
  get
} = Ember;

export default Route.extend({
  model(){
    const user = this.modelFor('index');

    if (get(user, 'isVerified')) {
      this.transitionTo('client');
    }
  }
});
