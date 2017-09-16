import Ember from 'ember';
import productGroupValidations from 'contetto/validations/product-group';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';

const {
  Route,
  get,
  RSVP: { hash }
} = Ember;

export default Route.extend({
  model(params) {
    const brand = this.modelFor('brand.edit');
    const productGroupId = params.product_group_id;
    var productGroup = this.store.findRecord('product-group', productGroupId);
    return hash({
      isProductGroupListActive: true,
      productGroupValidations,
      productGroup,
      changeset: new Changeset(productGroup, lookupValidator(productGroupValidations), productGroupValidations)
    });
  },
  deactivate(){
    if (get(this.currentModel, 'productGroup.hasDirtyAttributes')) {
      this.currentModel.productGroup.rollbackAttributes();
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
