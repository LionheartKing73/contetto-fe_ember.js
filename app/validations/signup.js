import {
  validateFormat,
  validatePresence,
  validateConfirmation
} from 'ember-changeset-validations/validators';

export default {
  email: [
    validatePresence({ presence: true, message: 'Email is Required!' }),
    validateFormat({
      allowBlank: true,
      regex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      message: 'Invalid Email!'
    }),
  ],
  password: validatePresence({ presence: true, message: 'Password is required!' }),
  confirmPassword: validateConfirmation({ on: 'password', message: 'Password and confirm password must be same!' }),
  firstName: validatePresence({ presence: true, message: 'First name is required!' }),
  lastName: validatePresence({ presence: true, message: 'Last name is required!' }),
  phoneNumber: [
    validatePresence({ presence: true, message: 'Phone number is required!' }),
    validateFormat({regex: /^([\+]?[1-9][0-9]*\s*[-\/\.]?\s*)?(\((\d{3})\)|(\d{3}))\s*[-\/\.]?\s*(\d{3})\s*[-\/\.]?\s*(\d{4})\s*(([xX]|[eE][xX][tT]?[\.]?|extension)\s*([#*\d]+))*$/,
    allowBlank: true,
    message: "Phone Number is invalid"
  })
  ]
};
