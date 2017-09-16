import Ember from 'ember';

const {
  Component,
  set, get
} = Ember;

export default Component.extend({
  actions: {
    changeDepartment(department) {
      set(this, 'changeset.department', department);
    },
    removeStep() {
      this.removeStep(get(this, 'changeset'));
    },
    showDepartmentModal(name){
      this.set('department.changeset.name', name);
      $("#department-modal-open").click();
    },
    departmentSuggestion(name){
      return "Create Department with name " + name;
    },
    onSave(dept){
      $("#department-modal-close").click();
      this.send('changeDepartment', dept);
    },
    addMember(){
      this.addMember();
    },
    removeMember(member){
      this.removeMember(member);
    }
  }
});
