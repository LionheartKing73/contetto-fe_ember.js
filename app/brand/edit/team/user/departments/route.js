import Ember from 'ember';

const {
  Route,
  get, set,
  RSVP: { hash }
} = Ember;

export default Route.extend({
  model (params) {
    const { brand_id } = this.paramsFor('brand.edit');
    const brandMember = this.modelFor('brand.edit.team.user');

    return hash({
      brandMember,
      member: brandMember.get('user'),
      departments: this.store.query('department', { brand: brand_id }).then((depts) => {
        return depts.filter(function(dept) {
          return dept.get('departmentMembers').mapBy('user.id').includes(brandMember.get('user.id'));
        });
      })
    });
  },

  actions: {
    removeDept(dept) {
      if (confirm('Please confirm that you want to remove this department?')){
        set(this, 'deleting', true);
        dept.destroyRecord().then(() => {
          get(this, 'toast').success('Department has been removed successfully.');
        }, () => {
          get(this, 'toast').error('Failed to delete department.');
        }).finally(() => set(this, 'deleting', false));
      }
    }
  }
});
