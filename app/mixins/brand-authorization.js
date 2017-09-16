import Ember from 'ember';

const {
  Mixin,
  get, set,
  inject: { service }
} = Ember;

export default Mixin.create({
  session: service(),
  toast: service(),

  beforeModel(transition) {
    const currentBrandRole = get(this, 'session.currentBrandRole');

    if (!currentBrandRole) {
      return Error('Cannot find the current user role!!');
    }

    const canAccessRoute = get(currentBrandRole, get(this, 'authorizationAttribute'));

    if (get(this, 'authorizationFailedRoute') && !canAccessRoute) {
      get(this, 'toast').error("You are not authorized to access this page.");
      this.transitionTo(get(this, 'authorizationFailedRoute'));
    }
  },

  canAllowBrandAccess(attribute) {
    const currentBrandRole = get(this, 'session.currentBrandRole');

    if (!currentBrandRole) {
      return Error('Cannot find the current user role!!');
    }

    const canAccessRoute = get(currentBrandRole, attribute);

    if (!canAccessRoute) {
      get(this, 'toast').error("You are not authorized to perform this action.");
      return false;
    }

    return true;
  }
});
