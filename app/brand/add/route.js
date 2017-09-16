import Ember from 'ember';
import BrandValidations from 'contetto/validations/brand';
import CompanyAuthorization from 'contetto/mixins/company-authorization';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';

const {
  Route,
  get,
  set,
  inject,
  RSVP
} = Ember;

// Constant BrandsAddRoute
export default Route.extend(CompanyAuthorization, {
  session: inject.service(),
  authorizationAttribute: 'manageBrands',
  authorizationFailedRoute: 'company.edit.details',

  model() {
    const company = this.modelFor('company.edit');
    var brand = this.store.createRecord('brand', { company });
    return RSVP.hash({
      BrandValidations,
      verticals: this.store.findAll('vertical', { backgroundReload: false }),
      locations: this.store.findAll('location', { backgroundReload: false }),
      brand: brand,
      changeset: new Changeset(brand, lookupValidator(BrandValidations), BrandValidations)
    });
  },

  afterModel(){
    set(this, 'session.brand', null);
  },

  deactivate(){
    if (get(this.currentModel, 'brand.isNew')) {
      this.currentModel.brand.destroyRecord();
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
