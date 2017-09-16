import Ember from 'ember';
import BrandAuthorization from 'contetto/mixins/brand-authorization';
import DS from 'ember-data';

const TeamIniviteUserRoute = Ember.Route.extend(BrandAuthorization, {
  //get Toast
  session: Ember.inject.service(),
  toast: Ember.inject.service(),
  authorizationAttribute: 'manageTeam',
  authorizationFailedRoute: 'brand.edit.team.invites.list',

  model() {
    let brand = this.modelFor('brand.edit');
    let brandRoles = this.store.query('brand-role', {
      id: brand.get('id')
    });
    const canOverrideReviewStructure = this.get('session.currentCompanyRole.overrideReviewStructure');

    return brandRoles.then((roles) => {
      return Ember.RSVP.hash({
        isTeamUsersActive: true,
        roles: roles,
        brandInvite: this.store.createRecord('invite', {
          type: 'brand',
          brandRole: roles.get('firstObject')
        }),
        brandId: brand.get('id'),
        errors: DS.Errors.create(),
        data: Ember.Object.create({
          isSubmitted: false
        })
      });
    });

  },
  afterModel(model) {
    let brandId = this.modelFor('brand.edit').id;
    let brand = this.store.peekRecord('brand', brandId);

    if (brandId) {
      model.brandInvite.set('brand', brand);
    }
    else {
      this.transitionTo('home');
    }
  },
  deactivate() {
    if (this.currentModel.brandInvite.get('isNew')) {
      this.currentModel.brandInvite.destroyRecord();
    }
  },
  actions: {
    willTransition: function(transition) {
      if (!this.currentModel.brandInvite.get("hasDirtyAttributes")) {
        return true;
      }
      else if (confirm("Your information will be lost, if you exit this page. Are you sure?")) {
        return true;
      }
      else {
        transition.abort();
      }
    },

    addMember() {

      if (this.validate()) {
        let brandInvite = this.currentModel.brandInvite;
        brandInvite.save().then((res) => {
          this.setSuccessMessage();
          //   console.log(res);
        }, (err) => {
          console.log(err);
          this.currentModel.data.set('isSubmitted', false);
        });
      }
    },
  },

  setSuccessMessage() {
    let brandId = this.currentModel.brandId;
    this.currentModel.data.set('isSubmitted', false);
    this.get('toast').success('Member has been invited successfuly');
    this.transitionTo('brand.edit.team', brandId);
  },

  validate() {
    let member = this.currentModel.brandInvite;
    let errors = this.currentModel.errors;

    if (!member.get('email')) {
      errors.add('email', 'Please enter user email!');
    }
    else {
      errors.remove('email');
    }

    if (!member.get('brandRole.id')) {
      errors.add('role', 'Please select a role!');
    }
    else {
      errors.remove('role');
    }
    this.modelFor('brand.edit.team').members.forEach((brandMember) => {
      if (member.get("email") == brandMember.get("email")) {
        errors.add('email', "Team Member with email already exists")
        return;
      }
    })

    return errors.get('isEmpty');
  }
});

export default TeamIniviteUserRoute;
