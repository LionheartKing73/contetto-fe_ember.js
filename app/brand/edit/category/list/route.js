import Ember from 'ember';

const {
  Route,
  RSVP: { hash }
} = Ember;

export default Route.extend({
  model () {
    const { brand_id } = this.paramsFor('brand.edit');

    return hash ({
      brandId: brand_id,
      categories: this.store.query('category', { brand: brand_id })
    });
  }
});
