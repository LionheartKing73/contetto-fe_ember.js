import Ember from 'ember';

const {
  Component,
  get, set,
  computed,
  inject: { service },
} = Ember;

export default Component.extend({
  toast: service(),

  disableSave: computed.or('changeset.isPristine', 'isSaving'),

  actions: {
    save(changeset) {
      changeset.validate().then(() => {
        if(changeset.get('isValid')) {
          set(this, 'isSaving', true);
          changeset.save()
          .then(() => {
            get(this, 'toast').success('Category saved successfully!', 'Success');
            this.transitionTo('brand.edit.category');
          })
          .catch(() => {
            get(this, 'toast').error('Unable to create category', 'Error');
          })
          .finally(() => {
            set(this, 'isSaving', false);
          });
        }
      });
    }
  }
});
