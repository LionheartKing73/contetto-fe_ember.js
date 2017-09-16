import Ember from 'ember';
const {
  Route,
  get,
  inject,
  RSVP
} = Ember;

export default Route.extend({
    store: inject.service('store'),
    session: inject.service('session'),
    model() {
        return RSVP.hash({
            'user': this.get("store").findRecord("user", this.get("session.data.authenticated.userId"))
        });
    },
    deactivate(){
      if (get(this.currentModel, 'user.hasDirtyAttributes')) {
        this.currentModel.user.rollbackAttributes();
      }
    },
    actions: {
      willTransition: function(transition){
        if(!this.currentModel.user.get("hasDirtyAttributes")){
          return true;
        }
        else if(confirm("Your information will be lost, if you exit this page. Are you sure?")){
          return true;
        }
        else{
          transition.abort();
        }
      }
    }
});
