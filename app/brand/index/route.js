import Ember from 'ember';

const {
  Route,
  isEmpty,
  get
} = Ember;

export default Route.extend({
  breadCrumb: null,
  beforeModel() {
    const brands = this.modelFor('brand');
    if (isEmpty(brands.filterBy('isNew', false))) {
      this.transitionTo('index');
    }
    else {
      this.transitionTo('brand.edit.dashboard', get(brands, 'firstObject'));
    }
  }
});
