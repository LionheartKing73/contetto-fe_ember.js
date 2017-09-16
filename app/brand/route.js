import Ember from 'ember';

const {
  Route,
  get,

} = Ember;

export default Route.extend({
  breadCrumb: {
    title: "x"
  },
  model() {
    return get(this.modelFor('company.edit'), 'brands');
  },
  afterModel(model) {

    this.set('breadCrumb', {
      title: "z"
    });


  }

});
