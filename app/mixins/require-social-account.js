import Ember from 'ember';

const { Mixin, get } = Ember;

export default Mixin.create({
  beforeModel(){
    const brand = this.modelFor('brand.edit');
    const accounts = get(brand, 'socialAccounts');
    if(!accounts || accounts.toArray().length === 0){
      this.transitionTo('brand.edit.required');
    }
  }
});
