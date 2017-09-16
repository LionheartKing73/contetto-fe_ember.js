import Ember from 'ember';
import BrandAuthorization from 'contetto/mixins/brand-authorization';
import ReviewChannelValidations from 'contetto/validations/reviewchannel';
import channelStepValidations from 'contetto/validations/channel-step';
import lookupValidator from 'ember-changeset-validations';
import Changeset from 'ember-changeset';

const {
  Route,
  inject: { service },
  RSVP: { hash },
  get, set
} = Ember;

export default Route.extend(BrandAuthorization, {
  authorizationAttribute: 'manageReviewStructure',
  authorizationFailedRoute: 'brand.edit.reviewflow.channels.list',

  session: service('session'),

  model(params) {
    const brand = this.modelFor('brand.edit');
    const channel = this.store.find("reviewChannel", params.channel_id);

    return channel.then(() => {
      return hash({
        ReviewChannelValidations,
        channelStepValidations,
        channel,
        brand: brand,
        steps: get(channel, 'steps'),
        removedSteps: [],
        changeset: new Changeset(channel, lookupValidator(ReviewChannelValidations), ReviewChannelValidations)
      });
    });
  },

  afterModel(model) {
    let steps = get(model, 'channel.steps');
    let validator = get(model, 'channelStepValidations');

    steps = steps.map((member) => {
      let changeset = new Changeset(member, lookupValidator(validator), validator);

      return changeset;
    })

    set(model, 'steps', steps);
  },

  nextOrder: function() {
    return get(this, 'currentModel.steps.length') + 1;
  },
  deactivate(){
    if (get(this.currentModel, 'channel.hasDirtyAttributes')) {
      this.currentModel.channel.rollbackAttributes();
    }
  },

  actions: {
    willTransition: function(transition){
      let dirtySteps = false;
      this.get("currentModel.steps").forEach((step)=>{
        if(step.get("isDirty")){
          dirtySteps=true;
          return;
        }
      });
      if(!this.currentModel.changeset.get("isDirty") && !dirtySteps){
        return true;
      }
      else if(confirm("Your information will be lost, if you exit this page. Are you sure?")){
        return true;
      }
      else{
        transition.abort();
      }
    },
    addStep() {
      let newStep = this.store.createRecord('channel-step', {
        order: this.nextOrder()
      });

      let validator = get(this, 'currentModel.channelStepValidations');
      let changeset = new Changeset(newStep, lookupValidator(validator), validator);
      get(this, 'currentModel.steps').pushObject(changeset);
    },

    removeStep(step) {
      if (step.get('id')) {
        get(this, 'currentModel.removedSteps').pushObject(step.get('_content'));
      }

      get(this, 'currentModel.steps').removeObject(step);
    }
  }
});
