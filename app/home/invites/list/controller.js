import Ember from 'ember';

export default Ember.Controller.extend({
  waitingInvites: Ember.computed.filterBy('model.invites', 'status', 'waiting')
});
