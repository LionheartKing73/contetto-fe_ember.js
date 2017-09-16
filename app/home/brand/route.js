import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {
  Route,
  inject: {
    service
  },
  get,
  set,
  setProperties
} = Ember;

export default  Route.extend(AuthenticatedRouteMixin, {
  //get storage session
  session: service('session'),

  beforeModel(transition) {
    setProperties(transition.resolvedModels.home, {
      '_isTopMenuOpened': false,
      '_isInboxNavMenuHide': true,
      '_isRightSideMenuOpened': false,
      '_isLeftSideMenuOpened': false,
      '_isRightFilterMenuHide': true
    });
  },

  model({ brand_id }) {
    let session = get(this, 'session');
    set(session, 'brandId', brand_id);
    return this.store.findRecord('brand', brand_id);
  },

  afterModel(model){
    return get(model, 'brandMembers');
  }
});
