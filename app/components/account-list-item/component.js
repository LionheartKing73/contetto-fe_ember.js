import Ember from 'ember';
import BrandAuthorization from 'contetto/mixins/brand-authorization';

const {
  Component,
  set,
  get,
  inject: { service }
} = Ember;

export default Component.extend(BrandAuthorization, {
	session: service(),
  toast: service(),

  tagName: 'tr',

  actions: {
    delete(account){
      if (this.canAllowBrandAccess('manageSocialAccounts') && confirm('Are you sure you want to delete that account ?')) {
        set(this, 'deleting', true);
        account.destroyRecord()
          .then(() => {
            get(this, 'toast').success('Account deleted successfully', 'Deleted');
          }).finally(() => {
          set(this, 'deleting', false);
        });
      }
    }
  }
}).reopenClass({
  positionalParams: ['account']
});
