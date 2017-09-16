import Ember from 'ember';
import DS from 'ember-data';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const TeamIniviteUserRoute = Ember.Route.extend(AuthenticatedRouteMixin, {
  //get Toast
  toast: Ember.inject.service(),

  model() {
    let brand = this.modelFor('brand.edit');
    let brandId =  this.modelFor('brand.edit').id;
    let member = this.modelFor('brand.edit.team.user').user;

    return Ember.RSVP.hash({
      isTeamDetailsActive: true,
      roles: this.store.query('brandRole', {id: brandId}),
      member: member,
      brandId: brand.get('id'),
      roleId: member.get('brandRole.id'),
      errors: DS.Errors.create(),
      data: Ember.Object.create({
        isSubmitted: false
      })
    });

  },
  actions: {
    updateMember() {
      if (this.validate()) {
        this.currentModel.data.set('isSubmitted', true);
        let member = this.currentModel.member;

        let roleId = this.currentModel.roleId,
          role = this.store.peekRecord('brandRole', roleId),
          brandId = this.currentModel.brandId;
        if (roleId) {
          member.set('brandRole', role);
        }
        member.save().then(() => {
          this.currentModel.data.set('isSubmitted', false);
          this.get('toast').success('Role has been changed successfuly');
          this.transitionTo('brand.edit.team', brandId);
        }, () => {
          member.rollbackAttributes();
          this.currentModel.data.set('isSubmitted', false);
        });
      }
    }
  },
  validate() {
    let errors = this.currentModel.errors;

    if (!this.currentModel.roleId) {
      errors.add('role', 'Please select a role!');
    } else {
      errors.remove('role');
    }

    return errors.get('isEmpty');
  }
});

export default TeamIniviteUserRoute;
