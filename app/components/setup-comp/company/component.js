import Ember from 'ember';

const {
  Component,
  set,
  get,
  inject
} = Ember;

export default Component.extend({
  toast: inject.service(),

  actions: {
    save(changeset){
      changeset.validate('name').then(() => {
        if (changeset.get('isValid')) {
          set(this, 'saving', true);
          changeset.save().then(company => {
            get(this, 'toast').success('Company saved successfully!', 'Success');
            this.transitionTo('setup.subscription', company.id);
          }).catch(() => set(this, 'saving', false));
        }
      });
    }
  }
});
