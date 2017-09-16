import Ember from 'ember';
import BrandValidations from 'contetto/validations/brand';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';

const {
  Route,
  RSVP,
  get
} = Ember;

// Constant BrandsAddRoute
export default Route.extend({
  beforeModel(){
    var brand = this.modelFor('brand.edit');
    if (brand.get("timezone") == "" || brand.get("timezone") == null) {
      brand.set("timezone", moment.tz.guess());
    }
    return brand.save();
  },
  model() {
    var brand = this.modelFor('brand.edit');
    return RSVP.hash({
      BrandValidations,
      verticals: this.store.findAll('vertical', {
        backgroundReload: false
      }),
      locations: this.store.findAll('location'),
      changeset: new Changeset(brand, lookupValidator(BrandValidations), BrandValidations)
    });
  },
  deactivate(){
    if (get(this.currentModel, 'brand.hasDirtyAttributes')) {
      this.currentModel.brand.rollbackAttributes();
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
