import Ember from 'ember';

const {
  set,
  get,
  Component,
  inject: { service },
  computed: { readOnly }
} = Ember;

export default Component.extend({
  defaultAudience: readOnly('model.brand.defaultTargetAudience'),
  toast: service(),

  actions: {
    setDefaultAudience(audience){
      const brand = get(this, 'model.brand');
      const previousAudience = get(brand, 'defaultTargetAudience');

      set(brand, 'defaultTargetAudience', audience);
      brand.save().then(() => {
        get(this, 'toast').success('Default target audience has been updated successfully.');
      }, () => {
        get(this, 'toast').error('Failed to update default target audience.');
        set(brand, 'defaultTargetAudience', previousAudience);
      });
    },

    deleteAudience(audience) {
      if (confirm('Please confirm that you want to remove this target audience?')){
        set(this, 'deleting', true);
        audience.destroyRecord().then(() => {
          get(this, 'toast').success('Target audience has been removed successfully.');
        }, () => {
          get(this, 'toast').error('Failed to delete target audience.');
        }).finally(() => set(this, 'deleting', false));
      }
    }
  }
});
