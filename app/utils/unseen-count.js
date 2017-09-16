import Ember from 'ember';
import config from 'contetto/config/environment';

const {
  get,
  inject: { service }
} = Ember;

export default Ember.Object.extend({
  ajax: service(),
  host: config.REST.host,
  contentType: 'application/json; charset=utf-8',

  getUnseenNotificationsCount: function(userId) {
    return get(this, 'ajax').request(`/notifications/v1/unseen?user=${userId}`, {
      method: 'GET',
      contentType: get(this, 'contentType')
    });
  },

  getUnseenBrandChatCount: function(userId, brandId) {
    return get(this, 'ajax').request(`/chats/v1/unseen?user=${userId}&brand=${brandId}`, {
      method: 'GET',
      contentType: get(this, 'contentType')
    });
  },

  getUnseenRoomChatCount: function(userId, roomId) {
    return get(this, 'ajax').request(`/chats/v1/unseen?user=${userId}&room=${roomId}`, {
      method: 'GET',
      contentType: get(this, 'contentType')
    });
  }
});
