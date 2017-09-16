import Ember from 'ember';
import User from 'contetto/utils/user';
import bcrypt from 'npm:bcryptjs';
import config from 'contetto/config/environment';

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
          var password = this.get("changeset.password");
          var hashedPassword = bcrypt.hashSync(password, config.salt);
          User.resetPassword(hashedPassword,get(changeset, 'token')).then(() => {
            get(this, 'toast').success('Password reset successfully.', 'Thank you!', {
              closeButton: false,
              progressBar: false
            });
            this.transitionTo('index');
          }).finally(() => set(this, 'isSubmitted', false));
        }
      });
    }
  }
});
