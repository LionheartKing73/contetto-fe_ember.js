import Ember from 'ember';
import categoryValidations from 'contetto/validations/category';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';

const {
  Route, get,
  RSVP: { hash }
}  = Ember;

export default Route.extend({
  model() {
    const brand = this.modelFor('brand.edit');
    const brandId = get(brand, 'id');
    var category = this.store.createRecord('category', {
      title: null,
      parent: null,
      brand: brand
    });
    return hash({
      categoryValidations,
      categories: this.store.query('category', { brand: brandId }),
      category,
      changeset: new Changeset(category, lookupValidator(categoryValidations), categoryValidations)
    });
  },
  deactivate(){
    if (get(this.currentModel, 'category.isNew')) {
      this.currentModel.category.destroyRecord();
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
