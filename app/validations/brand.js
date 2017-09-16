import {
    validatePresence,
    validateFormat,
    validateLength
}
from 'ember-changeset-validations/validators';

export default {
    name: [validatePresence({
        presence: true,
        message: 'Brand Name is required'
    }), validateLength({
        min: 3,
        allowBlank: false,
        message: "Brand name should be at least 3 characters"
    })],
    phone: [validateFormat({
        regex: /^([\+]?[1-9][0-9]*\s*[-\/\.]?\s*)?(\((\d{3})\)|(\d{3}))\s*[-\/\.]?\s*(\d{3})\s*[-\/\.]?\s*(\d{4})\s*(([xX]|[eE][xX][tT]?[\.]?|extension)\s*([#*\d]+))*$/,
        allowBlank: true,
        message: 'Phone Number is invalid'
    }), validateLength({
        min: 10,
        allowBlank: true,
        message: " Phone Number can't be less than 10 numbers"
    })],
    postal: validateFormat({
        regex: /^((\d{5}-\d{4})|(\d{5})|(\d{6})|([AaBbCcEeGgHhJjKkLlMmNnPpRrSsTtVvXxYy]\d[A-Za-z][\s-]?\d[A-Za-z]\d))$/,
        allowBlank: true,
        message: 'Zip / Postal is invalid'
    }),
    vertical: validatePresence({
        presence: true,
        message: 'Vertical is required'
    })
};
