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
      changeset.validate().then(() => {
        if (changeset.get('isValid')) {
          set(this, 'saving', true);
          changeset.save().then(brand => {
            get(this, 'toast').success('Brand created successfully!', 'Success');
            this.transitionTo('setup.audience', {
              brand,
              brand_id: get(brand, 'id'),
              company_id: get(brand, 'company.id')
            });
          }).catch(() => set(this, 'saving', false));
        }
      });
    }
  }
});
