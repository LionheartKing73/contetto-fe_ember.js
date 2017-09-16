import Ember from 'ember';

const {
  inject: {
    service
  }
} = Ember;

export default Ember.Component.extend({
  tokenParser: service('token-parser'),
  torii: service('torii'),

  changeStatus: false,
  pageDetails: {},
  showButton: Ember.computed.notEmpty('tokenParser.data'),
  showButtonCheck: Ember.computed('showButton', 'ensureShowButton', function() {
    return this.get('showButton') || this.get("ensureShowButton");
  }),
  checkPages: Ember.computed('tokenParser.data.[]', function() {
    if (!Ember.isEmpty(this.get('tokenParser.data'))) {
      const data = this.get('tokenParser.data.0');

      return (!Ember.isEmpty(data.pages)) ? true : false;
    }
    else {
      return false;
    }
  }),
  selectedPage: null,
  isWordpress: Ember.computed.equal('tokenParser.data.0.type', 'wordpress'),

  isFacebook: Ember.computed.equal('tokenParser.data.0.type', 'facebook'),
  showAddPage: Ember.computed('checkPages', 'isFacebook', 'changeStatus', 'isWordpress', function() {
    if (this.get('isFacebook') || this.get('isWordpress')) {

      if (this.get('changeStatus')) {
        return false;
      }

      if (this.get('checkPages')) {
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  }),

  clearTokenParser: Ember.on('willDestroyElement', function() {
    this.get('tokenParser').clear();
    this.set('changeStatus', false);
  }),

  validate() {
    let errors = this.get('model.errors');

    if (Ember.isEmpty(this.get('model.account.title'))) {
      errors.add('title', 'Title should not be empty');
      return false;
    }
    else {
      return true;
    }
  },
  init() {
    this._super();
  },
  didReceiveAttrs() {
    this.set("selectedPage", null);
    this.set("changeStatus", false);
    this.set("pageDetails", {});

  },
  urldecode(str) {
    return decodeURIComponent((str + '')
      .replace(/%(?![\da-f]{2})/gi, function() {
        // PHP tolerates poorly formed escape sequences
        return '%25'
      })
      .replace(/\+/g, '%20'))
  },
  actions: {
    signIn(provider) {
      this.get('torii').open(provider)
        .then(() => {
          this.set("ensureShowButton", true);
          this.set('model.account.title', this.urldecode(this.get('tokenParser.data.0.pageTitle')));
        }, (error) => {
          this.set("ensureShowButton", false);
          console.log(error);
        });
    },

    saveAccount() {
      let errors = this.get('model.errors');
      const brandId = this.get('model.brandId');
      const companyId = this.get('model.companyId');
      const platform = this.get('tokenParser.data.0.type');
      const token = this.get('tokenParser.data.0.token');

      this.set('model.account.platform', platform);

      if (this.get('model.type') === 'profile') {
        this.set('model.account.token', token);
      }
      else {
        let pageDetail = this.get('selectedPage');
        //alert("setting page 2...");
        this.set('model.account.pageId', pageDetail.id);
        this.set('model.account.pageTitle', pageDetail.attributes.name);
        this.set('model.account.token', pageDetail.attributes.token);
      }

      if (platform === 'twitter') {
        this.set('model.account.tokenSecret',
          this.get('tokenParser.data.0.tokenSecret')
        );

        this.set('model.account.pageId',
          this.get('tokenParser.data.0.pageId')
        );
      }
      else if (platform === 'linkedin') {
        this.set('model.account.pageId',
          this.get('tokenParser.data.0.pageId')
        );
      }

      if (this.validate()) {
        this.set('model.isSubmitted', true);

        this.get('model').account.save().then(() => {
          this.set('model.isSubmitted', false);
          errors.remove('title');

          this.get('tokenParser').clear();
          this.transitionTo('brand.edit.socialaccounts');
        }, () => {
          this.set('model.isSubmitted', false);
        });
      }
    },
    setPage(page) {
      //  alert("page set..");
      this.set('selectedPage', page);
      this.set('pageDetails', page);
      this.set("model.page", page);
      this.set("model.account.title", page.attributes.name);
      if (this.get('tokenParser.data.0.type') == "wordpress") {
        //     alert(page.attributes.token);
        this.set("model.account.token", page.attributes.token);

      }
    },
    facebookAction(type) {

      if (type === 'page' && !this.get('model.page')) {
        this.set('pageError', 'Please choose a page...');
        return false;
      }

      if (type === 'profile') {
        this.set('model.page', false);
      }
      // alert("page thing... " + JSON.stringify(this.get("selectedPage")));
      this.set('changeStatus', true);
      this.set('model.type', type);
      this.set('pageDetails', this.get('selectedPage'));
    },
    cancel() {
      this.transitionTo('brand.edit.socialaccounts');
    }

  }
});
