import {
  validatePresence,
  validateFormat,
} from 'ember-changeset-validations/validators';

export default {
  email: [
    validatePresence({ presence: true, message: 'Email is Required!' }),
    validateFormat({
      allowBlank: true,
      regex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      message:'Invalid Email!'
    }),
  ],
  password: validatePresence({ presence: true, message: 'Password is Required!' })
};