import Ember from 'ember';

const {
  Component,
  get,
  set,
  inject
} = Ember;

export default Component.extend({
  toast: inject.service(),

  isSubmitted: false,
  actions: {
    //Used to update Information
    save() {
      let component = this;
      const changeset = get(component, 'changeset');
      changeset.validate().then(() => {
        if (get(changeset, 'isInvalid') === true) {
          return;
        }
        set(component, 'isSubmitted', true);
        changeset.save().then(() => {
          component.logout();
        }).finally(() => {
          get(component, 'toast').success('A reset password email has been sent if your account was found.');
          set(component, 'isSubmitted', false);
        });
      });
    },
    cancel() {
      get(this, 'changeset').rollback();
    }
  }
});
