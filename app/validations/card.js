import {
  validatePresence,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  firstName: validatePresence({ presence: true, message: 'First Name is required' }),
  lastName: validatePresence({ presence: true, message: 'Last Name is required' }),
  zip: [
    validatePresence({ presence: true, message: 'End date is required' }),
    validateFormat({
      regex: /^((\d{5}-\d{4})|(\d{5})|(\d{6})|([AaBbCcEeGgHhJjKkLlMmNnPpRrSsTtVvXxYy]\d[A-Za-z][\s-]?\d[A-Za-z]\d))$/,
      allowBlank: true,
      message: 'Zip / Postal is invalid'
    })
  ],
  cardNumber: [
    validatePresence({ presence: true, message: 'Card Number is required' }),
    validateFormat({
      regex: /^\d{12,19}$/,
      allowBlank: true,
      message: 'Card Number is invalid'
    })
  ],
  expDate: [
    validatePresence({ presence: true, message: 'Expiration Date is required' })
  ],
  ccv2cvc2: [
    validatePresence({ presence: true, message: 'CVV Number is required' }),
    validateFormat({
      regex: /^\d{3,4}$/,
      allowBlank: true,
      message: 'CVV Number is invalid'
    })
  ],
  address: validatePresence({ presence: true, message: 'Address is required' }),

  country: validatePresence({ presence: true, message: 'Country is required' }),
  province: validatePresence({ presence: true, message: 'Province is required' }),
  city: validatePresence({ presence: true, message: 'City is required' }),
  user: validatePresence({ presence: true, message: 'User is required' })
};
