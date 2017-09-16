import Ember from 'ember';
import UserPasswordValidations from 'contetto/validations/user-password';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';

const {
  Route,
  get,
  inject,
  RSVP
} = Ember;

// Constant AccountSettingPasswordRoute
export default Route.extend({
  session: inject.service(),
  toast: inject.service(),

  model () {
    let userId = this.get('session.data.authenticated.userId');
    var user = this.store.findRecord('user', userId);
    return RSVP.hash({
      UserPasswordValidations,
      user,
      changeset: new Changeset(user, lookupValidator(UserPasswordValidations), UserPasswordValidations)
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
