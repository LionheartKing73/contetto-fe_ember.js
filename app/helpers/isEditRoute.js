import Ember from 'ember';
import router from 'contetto/mixins/main-router';

const {
  Helper,
  get
} = Ember;


export default Helper.extend(router,{
  compute() {
    return get(this,'currentRouteName').includes('edit');
  }
});