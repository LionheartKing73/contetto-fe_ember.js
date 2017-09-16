import ModalDialog from 'ember-modal-dialog/components/modal-dialog';

export default ModalDialog.extend({
  setup: function() {
    if (this.get('media.isMobile')) {
      Ember.$('body').addClass('modal-open');
    }
  }.on('didInsertElement'),

  teardown: function() {
    if (this.get('media.isMobile')) {
      Ember.$('body').removeClass('modal-open');
    }
  }.on('willDestroyElement')
});
