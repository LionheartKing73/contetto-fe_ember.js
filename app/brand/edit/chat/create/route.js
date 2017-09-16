import Ember from 'ember';
import roomValidations from 'contetto/validations/room';

const {
  Route,
  get, set,
  RSVP: { hash, all }
} = Ember;

export default Route.extend({
  model(params) {
    const brand = this.modelFor('brand.edit');
    const user  = this.modelFor('index');
    const room = this.store.createRecord('chatRoom', {
      name: "",
      brand: brand
    });

    get(room, 'users').pushObject(user);

    return hash({
      roomValidations,
      room,
      brandUsers: [],
      members: get(brand, 'brandMembers')
    });
  },

  afterModel(model) {
    return all(get(model, 'members').map((member) => {
      return get(member, 'user');
    })).then((users) => {
      set(model, 'brandUsers', users);
    })
  }
});
