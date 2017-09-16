import Ember from 'ember';

const {
  Mixin,
  getOwner,
  computed,
  computed: { readOnly }
} = Ember;

export default Mixin.create({
  router: computed(function () {
    return getOwner(this).lookup('router:main');
  }),
  currentRouteName: readOnly('router.currentRouteName')
});
