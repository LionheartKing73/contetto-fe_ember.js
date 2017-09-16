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

  actions: {
    save(changeset) {
      let component = this;
      changeset.validate().then(() => {
        if (get(changeset, 'isInvalid') === true) {
          return;
        }
        set(component, 'isSubmitted', true);
        changeset.save().then(role => {
          get(component, 'toast').success('Role created successfully!');
          component.transitionTo('company.edit.role', get(role,'company.id'));
        }).finally(() => {
          set(component, 'isSubmitted', false);
        });
      });
    },
    cancel(changeset) {
      changeset.rollback();
    }
  }
});
