import Ember from 'ember';
import {
  task,
  timeout
}
from 'ember-concurrency';

const {
  Component,
  set,
  get,
  inject,
  setProperties
} = Ember;

export default Component.extend({
  toast: inject.service(),
  store: inject.service(),

  init() {
    this._super(...arguments);
    let changeset = get(this, 'changeset');
    setProperties(changeset, {
      ageRanges: get(this, 'recommendedAgeRanges'),
      genders: get(this, 'recommendedGenders'),
    });
  },

  searchLocations: task(function*(term) {
    yield timeout(500);

    return this.get('store').query('location', {
      search: term
    });
  }),

  actions: {
    save(changeset) {
      changeset.validate().then(() => {
        if (changeset.get('isValid')) {
          set(this, 'saving', true);
          changeset.save().then(audience => {
            get(this, 'toast').success('Target Audience created successfully!', 'Success');
            this.transitionTo('setup.schedule', {
              brand: get(audience, 'brand'),
              brand_id: get(audience, 'brand.id'),
              company_id: get(audience, 'brand.company.id')
            });
          }).catch(() => set(this, 'saving', false));
        }
      });
    }
  }
});
