import Ember from 'ember';

const {
  Route,
  inject,
  get,
  set,
  RSVP: {
    hash,
    all
  }
} = Ember;

export default Route.extend({
  session: inject.service(),

  beforeModel(){
    return this.store.findAll('company', {
      reload: true
    }).then((c) => {
      //  alert("c!");
      return c;
    });
  },

  model() {
    const user = this.modelFor('index');
    var brandsArr = []
    this.store.peekAll('company').forEach((company)=>{
      brandsArr.push(company.get("brands"))
    });
    return hash({
      user,
      companies: this.store.peekAll('company'),
      brands: all(brandsArr)
    });
  },
  afterModel(model){
    var brandMembersArr = []
    model.brands.forEach((brand)=>{
      brandMembersArr.push(brand.get("brandMembers"));
    });
    return all(brandMembersArr);
  },
  setupController(controller, model) {
    // Call _super for default behavior
    this._super(controller, model);
    // Implement your custom setup after
    set(controller, 'session', get(this, 'session'));
  }
});
