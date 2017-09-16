import Ember from 'ember';

const {
  Component,
  isEmpty,
  isArray,
  inject: { service },
  get,
  set
} = Ember;

export default Component.extend({
  tagName: 'li',
  brandMember: null,
  canDelete: null,

  session: service(),
  toast: service(),
  store: service(),

  init() {
    this._super(...arguments);
    let userId = this.get('session.data.authenticated.userId');
    let component = this;
    get(this, 'model.brandMembers').then((members) => {
      if (!isEmpty(members) && isArray(members)) {
        let member = members.findBy('user.id', userId);
        set(component, 'brandMember', member);
        //Get role
        get(member, 'brandRole').then((brandRole) => {
          set(component, 'canDelete', get(brandRole, 'name').toLowerCase() === 'owner');
        });
      } else {
        get(component, 'store').unloadRecord(get(this, 'model'));
        //Transition to home
        component.transitionTo('index');
      }
    });
  },

  actions: {
    leaveBrand() {
      const component = this;
      const brandName = get(this, 'model.name');
      const canDelete = get(this, 'canDelete');
      if (confirm(`Are you sure you want to ${canDelete ? "delete" : "leave"} ${brandName} brand ?`)) {
        //Leave brand
        let brandMember = get(this, 'brandMember');
        set(brandMember, 'leave', 1);

        brandMember.save().then(() => {
          //Unload left brand
          get(component, 'store').unloadRecord(get(component, 'model'));
          get(component, 'toast').success(`Brand '${brandName}' has been left successfully`, 'Success');
          //Transition to home
          component.transitionTo('index');
        });
      }
    }
  }
});
