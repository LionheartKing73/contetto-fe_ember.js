import Ember from 'ember';

const {
  Component,
  get, set,
  inject: { service }
} = Ember;

export default Component.extend({
  ajax: service(),
  isSaving: false,
  verificationSent: false,

  actions: {
    resendVerification() {
      set(this, 'isSaving', true);
      get(this, 'ajax').request('users/v1/emailverification', {
        method: 'POST'
      }).then(() => {
        set(this, 'verificationSent', true);
      }).finally(() => {
        set(this, 'isSaving', false);
      })
    }
  }
});
