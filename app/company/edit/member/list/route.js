import Ember from 'ember';

const {
  Route,
  get,
  RSVP: {
    hash
  }
} = Ember;

export default Route.extend({
  model() {
    const companyMembers = get(this.modelFor('company.edit'), 'companyMembers');
    const user = this.modelFor('index');

    return hash({
      currentRole: companyMembers.then((members) => {

        return members.findBy('user.id', user.id).get('companyRole');
      }),
      members: companyMembers
    });
  }
});
