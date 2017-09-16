import Ember from 'ember';
import DS from 'ember-data';
import BrandAuthorization from 'contetto/mixins/brand-authorization';

const {
  Route,
  inject: {
    service
  }
} = Ember;

export default Route.extend(BrandAuthorization, {
  session: service(),
  toast: service(),
  authorizationAttribute: 'manageTeam',
  authorizationFailedRoute: 'brand.edit.team.user.details',

  model() {
    let brand = this.modelFor('brand.edit');
    let brandId = this.modelFor('brand.edit').id;
    let member = this.modelFor('brand.edit.team.user');
    const canOverrideReviewStructure = this.get('session.currentCompanyRole.overrideReviewStructure');

    return Ember.RSVP.hash({
      isTeamDetailsActive: true,
      roles: this.store.query('brandRole', {
        id: brandId
      }),
      member: member,
      brandId: brand.get('id'),
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

        let brandId = this.currentModel.brandId;

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

    if (!this.currentModel.member.brandRole) {
      errors.add('role', 'Please select a role!');
    }
    else {
      errors.remove('role');
    }

    return errors.get('isEmpty');
  }
});
