import Ember from 'ember';

const {
    Component,
    on,
} = Ember;

export default Component.extend({
  tagName: 'span',
  initTooltip: on('didInsertElement', function() {
    const title = this.get("title");

    this.$('.fieldDescription').tooltip({
      'title': title,
      'container': 'body',
      'html': true,
      'placement': 'auto top'
    }).on('show.bs.tooltip', function () {
      // if this is a touch-enabled device we add extra
      // empty mouseover listeners to the body's immediate children;
      // only needed because of broken event delegation on iOS
      // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
      if ('ontouchstart' in document.documentElement) {
        $('body').children().on('mouseover', null, $.noop)
      }
    }).on('hidden.bs.tooltip', function () {
      // if this is a touch-enabled device we remove the extra
      // empty mouseover listeners we added for iOS support
      if ('ontouchstart' in document.documentElement) {
        $('body').children().off('mouseover', null, $.noop)
      }
    }).on('click.bs.tooltip', function () {
      // Prevent the tooltip from being open always by accident.
      // Kill it when clicked on it.
      $(this).tooltip('hide');
    });
  })
});
