import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {
  Route,
  get,
  inject: {
    service
  }
} = Ember;

export default Route.extend(AuthenticatedRouteMixin, {
  queryParams: {
    chatMessageId: 0
  },
  store: service('store'),
  session: service('session'),
  model(params) {
    const {
      brand_id
    } = this.paramsFor('brand.edit');
    const {
      company_id
    } = this.paramsFor("company.edit");
    let messages = [];
    let highlightMessage = null;
    if(params.chatMessageId){
      highlightMessage = this.get('store').findRecord('chatMessage', params.chatMessageId);
      messages = this.get('store').query('chatMessage', {
        room: params.chatRoom_id,
        size: 100,
        nextMessage: params.chatMessageId
      });
    }
    else{
      messages = this.get('store').query('chatMessage', {
        room: params.chatRoom_id,
        size: 20
      });
    }
    return Ember.RSVP.hash({
      company: this.get('store').fetchRecord('company', company_id),
      room: this.get('store').findRecord('chatRoom', params.chatRoom_id),
      brand: this.get('store').fetchRecord('brand', brand_id),
      messages,
      highlightMessage,
      chatMessageId: params.chatMessageId
    });
  },
  // afterModel(model){
  //   return Ember.RSVP.all(model.messages.map((msg) => {
  //     return msg.get('attachments');
  //   }));
  // },
  actions: {
    roomSettings(room) {
      alert("here");
    }
  }
});
