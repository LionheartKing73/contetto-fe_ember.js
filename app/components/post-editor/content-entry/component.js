import Ember from 'ember';

export default Ember.Component.extend({

    networkPostProperties: {
        'facebook': {
            'max': 63206,
            'recommended': 40
        },
        'twitter': {
            'max': 140,
            'recommended': 93,
            'image': 25,
            'link': 24
        },
        'linkedin': {
            'max': 600,
            'recommended': 600
        },
        'wordpress': {
            'title': 70,
            'max': 63206,
            'recommended': 2000
        }
    },
    networkPhotoSizes: {
        'facebook': {
            'w': 1200,
            'h': 630
        },
        'twitter': {
            'w': 440,
            'h': 220
        },
        'linkedin': {
            'w': 550,
            'h': 375
        },
        'instagram': [{
            'w': 1080,
            'h': 1080
        }, {
            'w': 1080,
            'h': 566
        }, {
            'w': 1080,
            'h': 1350
        }]
    },

    length: Ember.computed('changeSet.content', {get() {
            if (this.get("deleted")) {
                return false;
            }

            return this.get('changeSet.content.length');
        }
    }),
    max: Ember.computed('lowestPlatform', 'length', 'socialAccounts.length', 'socialAccounts', {get() {
            if (this.get("deleted")) {
                return false;
            }

            if (this.get('socialAccounts.length') != 0) {

                var platform = this.get('lowestPlatform');
                if (platform != "none") {
                    //   console.log("max for " + platform);
                    return this.networkPostProperties[platform].max;
                }

            }
            return 0;
        }
    }),
    rec: Ember.computed('lowestPlatform', 'length', 'socialAccounts.length', 'socialAccounts', {get() {
            if (this.get("deleted")) {
                return false;
            }

            if (this.get('socialAccounts.length') != 0) {

                var platform = this.get('lowestPlatform');
                if (platform != "none") {

                    return this.networkPostProperties[platform].recommended;
                }

            }
            return 0;
        }
    }),
    overlimit: Ember.computed('max', 'length', {get() {
            if (this.get("deleted")) {
                return false;
            }

            if (this.get('max') > 0) {
                if (this.get('length') > this.get('max')) {
                    this.get("limitedAction")(true);
                    return true;
                }
                if (this.get('length') > 0) {
                    this.get("limitedAction")(false);
                }
            }
            else {
                this.get("limitedAction")(true);
            }
            return false;
        }
    }),
    myPlatforms: [],
    lowestPlatform: Ember.computed('length', 'socialAccounts.length', 'socialAccounts', {
        get() {
            if (this.get("deleted")) {
                return false;
            }
            var items = [];
            this.get("socialAccounts").forEach(function(account) {
                var pf = account.get('platform');
                items.push(pf);
                //   console.log("Max check: " + account.get('platform'));

            });
            var myPlatforms = items;
            if (myPlatforms.indexOf('twitter') > -1) {
                return 'twitter';
            }
            if (myPlatforms.indexOf('linkedin') > -1) {
                return 'linkedin';
            }
            if (myPlatforms.indexOf('facebook') > -1) {
                return 'facebook';
            }
            if (myPlatforms.indexOf('wordpress') > -1) {
                return 'wordpress';
            }
            return "none";

        }
    }),

    actions: {
        adjustHeight: function() {
            let textarea = this.$(".assignment-content");

            textarea.css('height', '1px')
            textarea.css('height', (25 + textarea.prop('scrollHeight')) + "px");
        }
    }
});
