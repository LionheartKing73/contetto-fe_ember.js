import DS from "ember-data";
import attr from 'ember-data/attr';
import Ember from 'ember';
import {
  belongsTo,
  hasMany
}
from 'ember-data/relationships';
// import ajax from 'contetto/app/services/ajax';
export default DS.Model.extend({
  session: Ember.inject.service(),
  ajax: Ember.inject.service(),
  name: attr('string'),

  brand: belongsTo('brand'),
  users: hasMany('user'),
  private: attr('to-boolean'),
  chatMessages: hasMany('chatMessage'),
  posting: belongsTo('posting'),
  campaign: belongsTo('campaign'),
  lastMessageTime: attr('date'),
  friendlyName: Ember.computed('name', function() {

    if (this.get("name").indexOf('~') !== -1) {
      var n = this.get("name").split("~");
      return n[0];
    }
    return this.get("name");

  }),
  unseenCount: Ember.computed('id', 'session.data.authenticated.userId', function(){
    return this.fetchUnseenCount();
  }),
  fetchUnseenCount: function(){
    let self = this;
    return DS.PromiseObject.create({
      promise: new Promise(function(resolve, reject){
        let userId = self.get('session.data.authenticated.userId');
        let roomId = self.get('id');
        self.get('ajax').request("https://gke.contetto.io/chats/v1/unseenRooms?user=" + userId + "&room=" + roomId).then((response) => {
          if(response.length>0 && response[0]["unreadMessagesCount"]){
            resolve(response[0]["unreadMessagesCount"]);
          }
          else{
            resolve(0);
          }
        });
      })
    });
  },
  reloadUnseenCount: function(){
    this.set('unseenCount', this.fetchUnseenCount());
  }

});
