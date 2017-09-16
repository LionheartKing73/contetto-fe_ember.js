import Ember from 'ember';
import roomValidations from 'contetto/validations/room';

const {
  Route,
  get, set,
  RSVP: { hash, all },
} = Ember;

export default Route.extend({
  model(params) {
    const brand = this.modelFor('brand.edit');

    return hash({
      roomValidations,
      room: this.store.findRecord('chatRoom', params.chatRoom_id),
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
