import Ember from 'ember';

const {
  set,
  get,
  Route,
  inject,
  setProperties,
  RSVP: { hash }
} = Ember;

export default Route.extend({
  session: inject.service(),

  model(){
    const user = this.modelFor('index');

    return hash({
      user,
      companies: this.store.findAll('company', { backgroundReload: false })
    });
  },

  afterModel(){
    setProperties(this, {
      'session.company': null,
      'session.brand': null
    });
  },

  setupController(controller, model) {
    // Call _super for default behavior
    this._super(controller, model);
    // Implement your custom setup after
    set(controller, 'session', get(this, 'session'));
  }
});
