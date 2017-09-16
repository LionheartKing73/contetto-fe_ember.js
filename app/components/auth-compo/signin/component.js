import Ember from 'ember';
import bcrypt from 'npm:bcryptjs';
import config from 'contetto/config/environment';
const {
  Component,
  inject,
  getProperties,
  get,
  set
} = Ember;

export default Component.extend({
  session: inject.service(),
  canDisplayErrors: false,
  rememberMe: false,
  // _rememberMeChanged: Ember.observer('rememberMe', function() {
  //   const expirationTime = this.get('rememberMe') ? (14 * 24 * 60 * 60) : null;
  //   this.set('session.store.cookieExpirationTime', expirationTime);
  // }),
  actions: {
    authenticate(changeset){
      changeset.validate().then(() => {
        if (changeset.get('isValid')) {
          let { email, password } = getProperties(changeset, 'email', 'password');
          var hashedPassword = bcrypt.hashSync(password, config.salt);
          set(this, 'isSubmitted', true);
          // validate credentials
          get(this, 'session').authenticate('authenticator:contetto', email, hashedPassword)
            .then(response => response && response.status === "403" ? this.transitionTo('verify', identification) : null)
            .finally(() => set(this, 'isSubmitted', false));
        }
      });
    },

    displayErrors() {
      set(this, 'canDisplayErrors', true);
    }
  }
});
