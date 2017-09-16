import Ember from 'ember';

const {
  Route,
  RSVP: { hash }
} = Ember;

export default Route.extend({
  model() {
    const brandId = this.paramsFor('brand.edit').brand_id;

    return hash({
      isProductGroupListActive: true,
      productGroups: this.store.query('product-group', { brand: brandId })
    });
  }
});

