import Ember from 'ember';
import CountryStateFilter from '../../../mixins/country-state-filter';

const {
  Component,
  get,
  set,
  isEmpty,
  inject,
  computed,
  RSVP
} = Ember;

export default Component.extend(CountryStateFilter, {

  session: inject.service(),
  store: inject.service(),
  toast: inject.service(),

  isSubmitted: false,
  uploadedLogo: null,
  isUploading: false,
  allFilled: Ember.computed('changeset.about', 'changeset.address', 'changeset.city', 'changeset.logo', 'changeset.name', 'changeset.phone', 'changeset.country.id', 'changeset.state.id', function() {


    if (this.get("changeset.about") != "" &&
      this.get("changeset.address") != "" &&
      this.get("changeset.city") != "" &&
      this.get("changeset.logo") != "" &&
      this.get("changeset.name") != "" &&
      this.get("changeset.phone") != "" &&
      this.get("changeset.country.id") != "" &&
      this.get("changeset.country.id") != null &&
      this.get("changeset.state.id") != null &&
      this.get("changeset.state.id") != "") {
      return true;
    }
    return false;

  }),
  states: computed('changeset.country.id', function() {
    const countryId = get(this, 'changeset.country.id');
    return isEmpty(countryId) ? RSVP.resolve() : get(this, 'store').query('location', {
      country: countryId
    });
  }),

  actions: {
    deleteCompany() {
      var self = this;
      var p = prompt("Are you sure you want to delete this company?\n\nWARNING: Deleting a company will subsequently delete all brands and related posting data. This is cannot be undone.\n\nTo delete this company, enter the name exactly as it appears:\n" + this.get("changeset.name"));
      if (p == this.get("changeset.name")) {

        if (confirm("Are you really sure you want to delete this company?")) {
          this.get('model.company').destroyRecord().then(function() {
            get(self, 'toast').success('Company has been deleted!');

            self.transitionTo('index');
          });
        }
      }

    },
    updatePostal(changeset, val) {
      set(changeset, 'postal', val.toUpperCase())
    },
    //Used to update Information
    updateInfo() {
      let component = this;
      let changeset = this.changeset;
      changeset.validate().then(() => {
        if (get(component, 'changeset.isInvalid') === true) {
          //console.log('isInvalid', get(component, 'changeset.error'));
          return;
        }
        set(component, 'isSubmitted', true);

        if (get(this, 'uploadedLogo') === null) {
          changeset.save().then(company => {
            get(component, 'toast').success('Company has been updated');
            component.transitionTo('company.edit.details', company.id);
          }).finally(() => {
            set(component, 'isSubmitted', false);
          });

        }
        else {
          this.send('uploadLogoAndSave', get(this, 'uploadedLogo'), changeset);
        }
      });
    },

    uploadLogoAndSave(file, changeset) {
      let store = get(this, 'store'),
        self = this;
      // reading uploaded file
      file.read().then(function(url) {
        // sending request to the server for upload a file
        // if request was completed, get media link of the object
        // and send a PATCH request to the brand at the "logo" relationships
        const companyId = get(self, 'changeset.id');
        // bucket name constructs by the rule "contetto-company-{company id}"
        const bucketName = "contetto-company-" + companyId;

        set(self, 'isUploading', true);
        file.upload('https://gke.contetto.io/files/v1/files', {
          multipart: true,
          data: {
            'bucket': bucketName,
            'Content-Type': 'image/gif',
            'name': get(file, 'name'),
            'public': 1
          }
        }).then((resp) => {
          const downloadLink = resp.body.data.attributes.downloadLink;

          set(self, 'uploadedLogo', null);
          set(self, 'isUploading', false);
          set(self, 'changeset.logo', downloadLink);
          self.send('updateInfo');
        });
      });
    },

    // action for uploading logo for the company
    uploadLogo(file) {
      if (file.get('size') / (1024 * 1024) > 1) {
        options.uploader.removeFile(file.get('file'))
        return get(this, 'toast').error('File size too large. Try uploading a logo less than 1 MB.');
      }

      set(this, 'uploadedLogo', file);
    },
    cancel() {
      get(this, 'changeset').rollback();
    }
  }
});
