import Ember from 'ember';
import categoryValidations from 'contetto/validations/category';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';

const {
  Route,
  get,
  set,
  RSVP: { hash }
}  = Ember;

export default Route.extend({
  model(params) {
    const { brand_id } = this.paramsFor('brand.edit');
    var category = this.store.findRecord('category', params.category_id);
    return hash({
      categoryValidations,
      category,
      categories: this.store.query('category', { brand: brand_id }),
      changeset: new Changeset(category, lookupValidator(categoryValidations), categoryValidations)
    });
  },

  afterModel(model){
    const descendant_ids = get(model, 'category.descendants').mapBy('id');
    const allCategories = get(model, 'categories');

    set(model, 'categories', allCategories.filter(item => {
      return !descendant_ids.includes(get(item, 'id')) && get(item, 'id') !== get(model, 'category.id');
    }));
  },
  deactivate(){
    if (get(this.currentModel, 'category.hasDirtyAttributes')) {
      this.currentModel.category.rollbackAttributes();
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
