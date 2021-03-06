import Ember from 'ember';

const {
  Component,
  get,
  set,
  inject
} = Ember;

export default Component.extend({
  session: inject.service(),
  toast: inject.service(),

  isSubmitted: false,

  allowedRoles: Ember.computed('model.roles', 'session.currentCompanyRole', function() {
    if (get(this, 'session.currentCompanyRole.administrator')) {
      return get(this, 'model.roles');
    }
    else {
      return get(this, 'model.roles').filter((role) => {
        return !get(role, 'administrator');
      });
    }
  }),

  actions: {
    save(changeset) {
      let component = this;
      changeset.validate().then(() => {
        if (get(changeset, 'isInvalid') === true) {
          return;
        }
        set(component, 'isSubmitted', true);
        changeset.save().then(invite => {
          get(component, 'toast').success('Member role updated successfully!');
          component.transitionTo('company.edit.member', get(invite, 'company.id'));
        }).finally(() => {
          set(component, 'isSubmitted', false);
        });
      });
    },
    cancel() {
      get(this, 'changeset').rollback();
    }
  }
});
