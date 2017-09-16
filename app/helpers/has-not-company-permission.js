import Ember from 'ember';

const {
  Helper,
  get,
  inject: { service }
} = Ember;

export default Helper.extend({
  session: service(),

  compute(params) {
    const currentBrandRole = get(this, 'session.currentCompanyRole');

    return !get(currentBrandRole, (params[0]).camelize());
  }
});
