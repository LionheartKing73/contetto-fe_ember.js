import Ember from 'ember';

const {
  Component,
  get,
  set,
  isEmpty,
  computed,
  inject,
  RSVP
} = Ember;

export default Component.extend({
  store: inject.service(),
  toast: inject.service(),

  isSubmitted: false,

  states: computed('changeset.country.id', function() {
    const countryId = get(this, 'changeset.country.id');
    return isEmpty(countryId) ? RSVP.resolve() : get(this, 'store').query('location', { country: countryId });
  }),

  actions: {
    updateInfo() {
      let component = this;
      const changeset = get(component, 'changeset');
      changeset.validate().then(() => {
        if (get(changeset, 'isInvalid') === true) {
          return;
        }
        set(component, 'isSubmitted', true);
        changeset.save().then(brand => {
          get(component, 'toast').success('Brand has been updated');
          component.transitionTo('brand.edit.details', brand.id);
        }).finally(() => {
          set(component, 'isSubmitted', false);
        });
      });
    },
    cancel() {
      this.changeset.rollback();
    }
  }
});
