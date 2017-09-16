import {
    validatePresence,
    validateFormat,
    validateLength
} from 'ember-changeset-validations/validators';

export default {
    firstName: validatePresence({ presence: true, message: 'First Name is required' }),
    lastName: validatePresence({ presence: true, message: 'LastName is required' }),
    phone: [
      validatePresence({ presence: true, message: 'Phone number is required!' }),
      validateLength({ min: 10, message: " Phone Number can't be less than 10 numbers" }),
      validateFormat({regex: /^([\+]?[1-9][0-9]*\s*[-\/\.]?\s*)?(\((\d{3})\)|(\d{3}))\s*[-\/\.]?\s*(\d{3})\s*[-\/\.]?\s*(\d{4})\s*(([xX]|[eE][xX][tT]?[\.]?|extension)\s*([#*\d]+))*$/,
        allowBlank: true,
        message: "Phone Number is invalid"
      })
    ],
    postalCode: validateFormat({ regex: /^((\d{5}-\d{4})|(\d{5})|(\d{6})|([AaBbCcEeGgHhJjKkLlMmNnPpRrSsTtVvXxYy]\d[A-Za-z][\s-]?\d[A-Za-z]\d))$/, message: 'Zip / Postal is invalid' }),
    sessionTimeout: function(key, value) {
      const val = parseInt(value);

      if (val === 0) {
        return true;
      }

      if (val < 5) {
        return "Session Timeout must to be more than 4 minutes or 0 (indicating infinite timeout)";
      }

      return true;
    }
};
