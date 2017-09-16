import Ember from 'ember';

const {
  Component,
  get,
  set,
  inject,
  RSVP,
  isEmpty,
  computed
} = Ember;

export default Component.extend({
  store: inject.service(),
  toast: inject.service(),
  allFilled: Ember.computed('changeset.about', 'changeset.address', 'changeset.city', 'changeset.firstName', 'changeset.isVerified', 'changeset.lastName', 'changeset.phone', 'changeset.postalCode', 'changeset.timezone', 'changeset.state', 'changeset.country', function() {

    if (this.get("changeset.about") != "" &&
      this.get("changeset.address") != "" &&
      this.get("changeset.city") != "" &&
      this.get("changeset.firstName") != "" &&
      this.get("changeset.isVerified") &&
      this.get("changeset.lastName") != "" &&
      this.get("changeset.phone") != "" &&
      this.get("changeset.postalCode") != "" &&
      this.get("changeset.timezone") != "" &&
      !Ember.isEmpty(this.get("changeset.state")) &&
      !Ember.isEmpty(this.get("changeset.country"))
    ) {
      return true;
    }
    return false;

  }),
  isSubmitted: false,

  countries: computed('model.locations', function() {
    return get(this, 'model.locations').filterBy('targetType', 'Country');
  }),
  states: computed('changeset.country.id', function() {
    const countryId = get(this, 'changeset.country.id');
    return isEmpty(countryId) ? RSVP.resolve() : get(this, 'store').query('location', {
      country: countryId
    });
  }),

  actions: {
    updatePostal(changeset, val) {
      set(changeset, 'postalCode', val.toUpperCase())
    },
    //Used to update Information
    save() {
      if(this.get("changeset.sessionTimeout")=="0"){
        this.get("toast").info("You entered 0 for Session Timeout. Your account would remain signed in even in inactivity.")
      }
      let component = this;
      const changeset = get(component, 'changeset');
      changeset.validate().then(() => {
        if (get(changeset, 'isInvalid') === true) {
          return;
        }
        set(component, 'isSubmitted', true);
        changeset.save().then(() => {
          get(component, 'toast').success('Account details has been updated');
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
