import {
  validatePresence
} from 'ember-changeset-validations/validators';


export default {
  title: validatePresence({ presence: true, message: 'Name is required!' }),
  ageRanges: validatePresence({ presence: true, message: 'Age Range is required!' }),
  genders: validatePresence({ presence: true, message: 'Gender is required!' }),
  locations: validatePresence({ presence: true, message: 'Location is required!' }),
  brand: validatePresence({ presence: true, message: 'Brand is required!' })
};
