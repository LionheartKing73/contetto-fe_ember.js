import Ember from 'ember';

const {
  Route,
  inject: {
    service
  },
  set,
  get,
  setProperties
} = Ember;

export default Route.extend({
  //get storage session
  session: service('session'),
  beforeModel(transition) {
    let session = this.get('session');

    if (!session.get('isAuthenticated')) {
      this.transitionTo('auth.index');
    }

    setProperties(transition.resolvedModels.home, {
      '_isTopMenuOpened': true,
      '_isInboxNavMenuHide': true,
      '_isRightSideMenuOpened': false,
      '_isLeftSideMenuOpened': false,
      '_isRightFilterMenuHide': false
    });

  },

  model({ comp_id }) {
    let session = get(this, 'session');
    set(session, 'companyId', comp_id);
    return {
      company: this.store.findRecord('company', comp_id),
      comp_id
    };
  },

  afterModel(model){
    return get(model, 'company.companyMembers');
  }
});
