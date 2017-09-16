import Ember from 'ember';
import UserValidations from 'contetto/validations/user';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';

const {
  Route,
  inject,
  get,
  RSVP
} = Ember;

// Constant AccountSettingDetailsRoute
export default Route.extend({
  session: inject.service(),
  toast: inject.service(),

  //model
  model() {
    let userId = get(this, 'session.data.authenticated.userId');
    var user = this.store.findRecord('user', userId);
    return RSVP.hash({
      UserValidations,
      user,
      locations: this.store.findAll('location', { backgroundReload: false }),
      changeset: new Changeset(user, lookupValidator(UserValidations), UserValidations)
    });
  },
  deactivate(){
    if (get(this.currentModel, 'user.hasDirtyAttributes')) {
      this.currentModel.user.rollbackAttributes();
    }
  },
  actions: {
    willTransition: function(transition){
      if(!this.currentModel.changeset.get("isDirty")){
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
