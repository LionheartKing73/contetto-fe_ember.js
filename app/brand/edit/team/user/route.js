import Ember from 'ember';

const {
  Route
} = Ember;

export default Route.extend({
  model(params) {
    return this.modelFor('brand.edit.team').members.findBy('id', params.memberId)
  }
});
