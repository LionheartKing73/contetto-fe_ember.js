import Ember from 'ember';
import brandValidations from 'contetto/validations/brand';

const {
  Route,
  setProperties,
  RSVP
} = Ember;

export default Route.extend({
  model({
    company_id
  }) {
    return RSVP.hash({
      company_id,
      company: this.store.findRecord('company', company_id),
      verticals: this.store.query('vertical', {
        'parentid': 0
      })
    });
  },

  afterModel(model) {
    let brand = this.store.createRecord('brand', {
      company: model.company
    });
    setProperties(model, {
      brand,
      brandValidations
    });
  },

  deactivate() {
    if (this.currentModel.brand.get('isNew')) {
      this.currentModel.brand.destroyRecord();
    }
  }
});
