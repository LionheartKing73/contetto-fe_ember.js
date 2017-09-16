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
  model() {
    const brand = this.modelFor('brand.edit');
    var productGroup = this.store.createRecord('product-group', {
      title: null,
      description: null,
      brand: brand
    });
    return hash({
      isProductGroupListActive: true,
      productGroupValidations,
      productGroup,
      changeset: new Changeset(productGroup, lookupValidator(productGroupValidations), productGroupValidations)
    });
  },
  deactivate(){
    if (get(this.currentModel, 'productGroup.isNew')) {
      this.currentModel.productGroup.destroyRecord();
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
