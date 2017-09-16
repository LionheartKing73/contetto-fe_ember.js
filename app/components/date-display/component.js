import Ember from 'ember';

const {
  Component,
  on,
  get,
  set
} = Ember;

export default Ember.Component.extend({
  brandZone: null,
  hasBrand: false,
  classNames: ['dateContainer'],
  init: function() {
    var bz = this.get('brand.timezone');
    if (bz != null && bz != "") {
      this.set("brandZone", bz);
      this.set("hasBrand", true);
    }
    else {
      this.set("brandZone", moment.tz.guess());
    }

    return this._super();
  },

  initTooltip: on('didInsertElement', function() {
    let brandZone = "";

    if (!get(this, 'date')) {
      return;
    }

    if (get(this, 'hasBrand')) {
      brandZone = `${get(this, 'brandZone')} : ${get(this, 'brandTime')} </br>`;
    }

    const title = `<span> ${brandZone} Local: ${get(this, 'local')} </br> UTC: ${get(this, 'utc')} </span>`;

    this.$('.dateDisplay').tooltip({
      'title': title,
      'html': true,
      'placement': 'auto top'
    }).on('show.bs.tooltip', function() {
      // if this is a touch-enabled device we add extra
      // empty mouseover listeners to the body's immediate children;
      // only needed because of broken event delegation on iOS
      // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
      if ('ontouchstart' in document.documentElement) {
        $('body').children().on('mouseover', null, $.noop)
      }
    }).on('hidden.bs.tooltip', function() {
      // if this is a touch-enabled device we remove the extra
      // empty mouseover listeners we added for iOS support
      if ('ontouchstart' in document.documentElement) {
        $('body').children().off('mouseover', null, $.noop)
      }
    });
  }),

  didUpdateAttrs() {
    this.initTooltip();
  },

  local: Ember.computed('date', {
    get() {
      /*global moment*/
      return moment(this.get('date')).format('DD/MM/YYYY h:mm:a');
    }
  }),

  fromnow: Ember.computed('date', {
    get() {
      return moment(this.get('date')).fromNow();
    }
  }),

  utc: Ember.computed('date', {
    get() {
      return moment(this.get('date')).tz('UTC').format('DD/MM/YYYY h:mm:a ');
    }
  }),

  brandTime: Ember.computed('date', {
    get() {
      return moment(this.get('date')).tz(this.get('brandZone')).format('DD/MM/YYYY h:mm:a ');
    }
  })
});
