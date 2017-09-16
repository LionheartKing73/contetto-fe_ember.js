import Ember from 'ember';
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
  session: inject.service(),
  termsAccept: false,
  privacyAccept: false,
  inviteCode: null,
  init() {
    this._super();
    this.set("termsAccept", false);
    this.set("privacyAccept", false);
  },
  actions: {
    signup(changeset) {
      let password = "";
      if (this.get("inviteCode") == "ContettoBeta17") {
        if (this.get("termsAccept") && this.get("privacyAccept")) {
          if (this.get("changeset.password").trim().length >= 6) {
            changeset.validate().then(() => {
              if (changeset.get('isValid')) {
                set(this, 'isSubmitted', true);
                password = this.get("changeset.password");
                let hashedPassword = bcrypt.hashSync(password, config.salt);
                this.set("changeset.password", hashedPassword);
                this.set("changeset.confirmPassword", hashedPassword);
                changeset.save().then(() => {
                  get(this, 'toast').success('Please check your email to verify your account.', 'Thank you for signing up!', {
                    closeButton: false,
                    progressBar: false
                  });
                  this.transitionTo('index');
                }).catch(() => {
                  this.set("changeset.password", password);
                  this.set("changeset.confirmPassword", password);
                }).finally(() => set(this, 'isSubmitted', false));
              }
            });
          }
          else {
            alert("You must enter password of minimum 6 characters(except spaces)");
          }
        }
        else {
          alert("You must accept Contetto's privacy policy and terms of use in order to sign up.");
        }
      }
      else {
        alert("Invalid invite code.");
      }
    }
  }
});
