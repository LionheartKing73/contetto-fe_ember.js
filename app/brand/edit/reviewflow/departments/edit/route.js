import Ember from 'ember';
import departmentValidations from 'contetto/validations/department';
import departmentMemberValidations from 'contetto/validations/department-member';
import BrandAuthorization from 'contetto/mixins/brand-authorization';
import lookupValidator from 'ember-changeset-validations';
import Changeset from 'ember-changeset';

const {
  Route,
  get, set,
  RSVP: { hash, all }
} = Ember;

export default Route.extend(BrandAuthorization, {
  authorizationAttribute: 'manageReviewStructure',
  authorizationFailedRoute: 'brand.edit.reviewflow.departments.list',

  model(params) {
    const brand = this.modelFor('brand.edit');
    const department = this.store.find('department', params.department_id);

    return department.then(() => {
      return hash({
        departmentValidations,
        members: brand.get('brandMembers').then((member) => {
          return all(member.mapBy('user'));
        }),
        department,
        duties: this.store.findAll('duty'),
        departmentMembers: get(department, 'departmentMembers'),
        deletedDepartmentMembers: [],
      });
    });
  },

  afterModel(model) {
    let members = get(model, 'departmentMembers');
    let validator = get(this, 'currentModel.departmentMemberValidations');
    let department = get(model, 'department');
    members = members.map((member) => {
      let changeset = new Changeset(member, lookupValidator(validator), validator);

      return changeset;
    })

    set(model, 'departmentMembers', members);
    set(model, 'changeset', new Changeset(department, lookupValidator(departmentValidations), departmentValidations));
  },
  deactivate(){
    if (get(this.currentModel, 'department.hasDirtyAttributes')) {
      this.currentModel.department.rollbackAttributes();
    }
  },

  actions: {
    willTransition: function(transition){
      let dirtyDeptMems = false;
      this.get("currentModel.departmentMembers").forEach((member)=>{
        if(member.get("isDirty")){
          dirtyDeptMems=true;
          return;
        }
      });
      if(!this.currentModel.changeset.get("isDirty") && !dirtyDeptMems){
        return true;
      }
      else if(confirm("Your information will be lost, if you exit this page. Are you sure?")){
        return true;
      }
      else{
        transition.abort();
      }
    },
    addMember() {
      let newMember = this.store.createRecord('department-member', {
        user: null
      });

      let validator = get(this, 'currentModel.departmentMemberValidations');
      let changeset = new Changeset(newMember, lookupValidator(validator), validator);
      get(this, 'currentModel.departmentMembers').pushObject(changeset);
    },

    removeMember(member) {
      if (member.get('id')) {
        get(this, 'currentModel.deletedDepartmentMembers').pushObject(member.get('_content'));
      }

      get(this, 'currentModel.departmentMembers').removeObject(member);
    }
  }
});
