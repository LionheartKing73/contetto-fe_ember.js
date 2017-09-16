import Ember from 'ember';
import User from 'contetto/utils/user';

const {
  Component,
  inject,
  get,
  set
} = Ember;

export default Component.extend({
  toast: inject.service(),

  actions: {
    reset(changeset){
      changeset.validate().then(() => {
        if (changeset.get('isValid')) {
          set(this, 'isSubmitted', true);
          User.requestPasswordReset(get(changeset, 'email')).then(() => {
          }).finally(() => {
            set(this, 'isSubmitted', false);
            get(this, 'toast').success('A reset password email has been sent if your account was found.', 'Thank you!', {
              closeButton: false,
              progressBar: false
            });
            this.transitionTo('index');
          });
        }
      });
    }
  }
});
