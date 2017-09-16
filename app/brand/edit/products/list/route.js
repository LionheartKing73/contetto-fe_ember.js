import Ember from 'ember';

const {
  Route,
  RSVP: { hash }
} = Ember;

export default Route.extend({
  model() {
    const brandId = this.paramsFor('brand.edit').brand_id;

    return hash({
      isProductListActive: true,
      products: this.store.query('product', { brand: brandId })
    });
  }
});

