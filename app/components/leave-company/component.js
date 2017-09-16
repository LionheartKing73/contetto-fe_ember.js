import Ember from 'ember';

const {
  Component,
  isEmpty,
  isArray,
  inject: { service },
  get,
  set,
  RSVP: { all }
} = Ember;

export default Component.extend({
  tagName: 'li',
  companyMember: null,
  canDelete: null,
  companyDetail: service('current-company'),
  session: service(),
  toast: service(),
  store: service(),

  init() {
    this._super(...arguments);
    let userId = this.get('session.data.authenticated.userId');
    let component = this;
    get(this, 'model.companyMembers').then((members) => {
      if (!isEmpty(members) && isArray(members)) {
        let member = members.findBy('user.id', userId);
        set(component, 'companyMember', member);
        //Get role
        get(member, 'companyRole').then((companyRole) => {
          set(component, 'canDelete', get(companyRole, 'name').toLowerCase() === 'owner');
        });
      } else {
        get(component, 'store').unloadRecord(get(this, 'model'));
        //Transition to home
        component.transitionTo('index');
      }
    });
  },

  actions: {
    leaveCompany() {
      const component = this;
      const companyName = get(this, 'model.name');
      const canDelete = get(this, 'canDelete');
      if (confirm(`Are you sure you want to ${canDelete ? "delete" : "leave"} ${companyName} company ?`)) {

        let promises = [];
        let companyMember = get(this, 'companyMember');
        let userId = this.get('session.data.authenticated.userId');

        // leave all company brands
        get(this, 'model.brands').then(brands => {
          brands.forEach(brand => {
            get(brand, 'brandMembers').then(members => {
              members = members.filterBy('user.id', userId);
              members.setEach('leave', 1);
              promises.pushObjects(members.invoke('save'));
            });
          });
        });

        // when leave all company brands is complete leave company
        all(promises).then(() => {
          set(companyMember, 'leave', 1);
          companyMember.save().then(() => {
            let store = get(component, 'store');
            let model = get(component, 'model');
            //Unload left company
            store.unloadRecord(store.peekRecord('company', model.content.id));
            get(component, 'toast').success(`Company '${companyName}' has been left successfully`, 'Success');
            //Transition to home
            component.transitionTo('index');
          });
        });

      }
    }
  }
});
