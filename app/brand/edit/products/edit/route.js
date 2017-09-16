import Ember from 'ember';
import productValidations from 'contetto/validations/product';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';

const {
  Route,
  get,
  RSVP: {
    hash
  }
} = Ember;

export default Route.extend({
  model(
    params
  ) {
    const brand = this.modelFor('brand.edit');
    const brandId = get(brand, 'id');
    const product_id = params.product_id;
    var product = this.store.findRecord("product", product_id);
    return hash({
      isProductListActive: true,
      productValidations,
      productGroups: this.store.query('product-group', {
        brand: brandId
      }),
      productTypes: this.store.findAll('product-type'),
      frequencies: this.store.findAll('frequency'),
      productDeliveries: this.store.findAll('product-delivery'),
      pricingTypes: this.store.findAll('pricing-type'),
      productAssessments: this.store.findAll('price-assessment'),
      currencies: this.store.findAll('currency'),
      locations: this.store.findAll('location'),
      targetAudiences: this.store.query('audience', {
        brand: brandId
      }),
      product,
      changeset: new Changeset(product, lookupValidator(productValidations), productValidations)
    });
  },
  deactivate(){
    if (get(this.currentModel, 'product.hasDirtyAttributes')) {
      this.currentModel.product.rollbackAttributes();
    }
  },
  actions: {
    willTransition: function(transition){
      if(!this.currentModel.changeset.get("isDirty")){
        return true;
      }
      else if(confirm("Your information will be lost, if you exit this page. Are you sure?")){
        return true;
      }
      else{
        transition.abort();
      }
    }
  }

});
