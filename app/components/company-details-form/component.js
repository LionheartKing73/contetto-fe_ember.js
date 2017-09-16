import Ember from 'ember';

const {
  Component,
  get,
  set,
  isEmpty,
  inject,
  computed,
  RSVP
} = Ember;

export default Component.extend({
  store: inject.service(),
  toast: inject.service(),

  isSubmitted: false,

  states: computed('changeset.country.id', function() {
    const countryId = get(this, 'changeset.country.id');
    return isEmpty(countryId) ? RSVP.resolve() : get(this, 'store').query('location', {
      country: countryId
    });
  }),

  actions: {
    //Used to update Information
    updateInfo() {
      let component = this;
      this.changeset.validate().then(() => {
        if (get(component, 'changeset.isInvalid') === true) {
          //console.log('isInvalid', get(component, 'changeset.error'));
          return;
        }
        set(component, 'isSubmitted', true);
        get(component, 'changeset').save().then(company => {
          get(component, 'toast').success('Company has been updated');
          component.transitionTo('company.edit.details', company.id);
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
