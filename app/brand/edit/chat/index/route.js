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
  beforeModel() {
    let rooms = this.modelFor("brand.edit.chat").rooms;
    let chatRoom = rooms.sortBy("lastMessageTime").get("lastObject");
    if($(window).width()>900){
      this.transitionTo('brand.edit.chat.details', this.paramsFor("company.edit").company_id, this.paramsFor('brand.edit').brand_id, chatRoom.get("id"))
    }
  },
  model(){
    return this.modelFor("brand.edit.chat").rooms;
  }
});
