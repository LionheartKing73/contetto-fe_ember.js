import Ember from 'ember';
import Ps from 'npm:perfect-scrollbar';

const {
  Mixin,
  on,
  get,
  run: { scheduleOnce, throttle, later }
} = Ember;

export default Mixin.create({
  tabWrapperClass: null,
  leftArrow: '<span class="left-arrow"><i class="fa fa-chevron-left"></i></span>',
  rightArrow: '<span class="right-arrow"><i class="fa fa-chevron-right"></i></span>',

  didReceiveAttrs: function() {
    scheduleOnce('afterRender', () => {
      this.autoHideShowArrows();
    });
  },

  initTabScroll: on('didInsertElement', function() {
    if (!get(this, 'tabWrapperClass')) {
      return;
    }

    scheduleOnce('afterRender', () => {
      Ps.initialize(this.$(get(this, 'tabWrapperClass') + ' > div').get(0));
      this.insertArrows();
      this.initHorizonalTabScroll();
    });
  }),

  insertArrows: function() {
    const $wrapper = this.$(get(this, 'tabWrapperClass'));

    $wrapper.prepend(get(this, 'leftArrow'));
    $wrapper.append(get(this, 'rightArrow'));
  },

  initHorizonalTabScroll: function() {
    let tabWrapperClass = get(this, 'tabWrapperClass'),
        leftPaddle = tabWrapperClass + " > span.left-arrow",
        rightPaddle = tabWrapperClass + " > span.right-arrow",
        scrollDuration = 300,
        self = this;

    this.autoHideShowArrows();

    // scroll to left
    this.$(rightPaddle).on('click.scrollable_tabs', function() {
      let $target = self.$(tabWrapperClass + ' > div');
      $target.animate( { scrollLeft: $target.scrollLeft() + 300 }, scrollDuration);
    });

    // scroll to right
    this.$(leftPaddle).on('click.scrollable_tabs', function() {
      let $target = self.$(tabWrapperClass + ' > div');
      $target.animate( { scrollLeft: $target.scrollLeft() - 300 }, scrollDuration);
    });

    // finally, what happens when we are actually scrolling the menu
    this.$(tabWrapperClass + ' > div').on('scroll.scrollable_tabs', function() {
      self.autoHideShowArrows();
    });

    // Compute arrows when window is resized
    Ember.$(window).on('resize.scrollable_tabs', function() {
      throttle(self, function() {
        later(self, self.autoHideShowArrows, 150);
      }, 150, false);
    })
  },

  destroyHorizonalTabScroll: on('willDestroyElement', function() {
    let tabWrapperClass = get(this, 'tabWrapperClass');

    this.$(tabWrapperClass + " > span.right-arrow").off('click.scrollable_tabs');
    this.$(tabWrapperClass + " > span.left-arrow").off('click.scrollable_tabs');
    this.$(tabWrapperClass + " > div").off('scroll.scrollable_tabs');
    Ember.$(window).off('resize.scrollable_tabs');
  }),

  autoHideShowArrows: function() {
    let tabWrapperClass = get(this, 'tabWrapperClass'),
        leftPaddle = tabWrapperClass + " > span.left-arrow",
        rightPaddle = tabWrapperClass + " > span.right-arrow",
        totalWidth = this.$(tabWrapperClass + ' > div > ul').outerWidth(),
        scrollLeft = this.$(tabWrapperClass + ' > div').scrollLeft();

    // show & hide the paddles
    // depending on scroll position
    if (scrollLeft <= 0) {
      this.$(leftPaddle).addClass('hidden');
      this.$(rightPaddle).removeClass('hidden');
    } else if ((scrollLeft + this.$(tabWrapperClass + " > div").outerWidth()) >= totalWidth) {
      this.$(leftPaddle).removeClass('hidden');
      this.$(rightPaddle).addClass('hidden');
    } else {
      // show both paddles in the middle
      this.$(leftPaddle).removeClass('hidden');
      this.$(rightPaddle).removeClass('hidden');
    }

    if (totalWidth <= this.$(tabWrapperClass + " > div").outerWidth()) {
      this.$(rightPaddle).addClass('hidden');
    }
  }
});
