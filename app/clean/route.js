import Ember from 'ember';

const { Route, get, RSVP: { allSettled }, inject } = Ember;

export default Route.extend({
  session: inject.service(),

  model(){
    if (confirm('Are you sure you want to clean all user related Companies, Brands & invites ?')) {

      const userId = get(this, 'session.data.authenticated.userId');

      let promises = [];

      this.store.findAll('brand').then(brands => {
        brands.forEach(brand => {

          this.store.query('goal', { brand: get(brand, 'id') }).then(goals => {
            promises.pushObject(allSettled(goals.invoke('destroyRecord')));
          });

          get(brand, 'socialAccounts').then(items => {
            promises.pushObject(allSettled(items.invoke('destroyRecord')));
          });

          get(brand, 'campaigns').then(items => {
            promises.pushObject(allSettled(items.invoke('destroyRecord')));
          });

          get(brand, 'categories').then(items => {
            promises.pushObject(allSettled(items.invoke('destroyRecord')));
          });

          get(brand, 'targetAudiences').then(items => {
            promises.pushObject(allSettled(items.invoke('destroyRecord')));
          });

          get(brand, 'brandRoles').then(roles => {
            promises.pushObject(allSettled(roles.invoke('destroyRecord')));
          });

          get(brand, 'brandMembers').then(members => {
            promises.pushObject(allSettled(members.filterBy('user.id', userId).invoke('destroyRecord')));
          });

          allSettled(promises).then(() => promises.pushObject(brand.destroyRecord()));
        });
      });

      this.store.findAll('company').then(companies => {
        companies.forEach(company => {

          get(company, 'companyRoles').then(roles => {
            promises.pushObject(allSettled(roles.invoke('destroyRecord')));
          });

          get(company, 'companyMembers').then(members => {
            promises.pushObject(allSettled(members.filterBy('user.id', userId).invoke('destroyRecord')));
          });

          allSettled(promises).then(() => promises.pushObject(company.destroyRecord()));
        });
      });

      this.store.findAll('invite').then(invites => promises.pushObject(allSettled(invites.invoke('destroyRecord'))));

      return allSettled(promises);
    }
  },

  afterModel(){
    this.transitionTo('index');
  }
});
