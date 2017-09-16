import Ember from 'ember';

const {
  Route,
  inject,
  get,
  set,
  setProperties
} = Ember;

export default Route.extend({
  session: inject.service(),
  toast: Ember.inject.service(),
  model({
    company_id
  }) {
    var self = this;
    return this.store.findRecord('company', company_id, {
      reload: true
    }).then((b) => {
      //alert("b! " + company_id);
      setProperties(self, {
        'session.company': b,
        'session.brand': null
      });
      return b;
    });
  },

  afterModel(model) {
    setProperties(this, {
      'session.company': model,
      'session.brand': null
    });
    if(!model.get('subscription.id')){
      this.get('toast').error("Please add subscription first.");
      this.transitionTo("setup.subscription", model.get('id'));
    }
    else if(model.get('isLocked')){
      this.transitionTo("company.edit.balance", model.get('id'));
    }
    else{
      const userId = get(this, 'session.data.authenticated.userId');

      return model.get('companyMembers').then((members) => {
        const currentMember = members.findBy('user.id', userId);

        return get(currentMember, 'companyRole').then((role) => {
          set(this, 'session.currentCompanyRole', role);
        });
      });
    }
  }
});
