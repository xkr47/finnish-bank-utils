(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('FinnishBankUtils', ['module'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod);
    global.FinnishBankUtils = mod.exports;
  }
})(this, function (module) {
  'use strict';

  var REF_NUMBER_MULTIPLIERS = [1, 3, 7],
      REF_NUMBER_REGEX = /[\d]{4,20}/,
      FINNISH_IBAN_REGEX = /^FI[\d]{16}$/,
      IBAN_OFFSET_FROM_ASCIICODE = -55;

  function removeAllWhiteSpaces(str) {
    return str.replace(/\s+/g, '');
  }

  function removeLeadingZeros(str) {
    return str.replace(/^0+/, '');
  }

  function countryCodeToNumber(code) {
    return "" + (code.charCodeAt(0) + IBAN_OFFSET_FROM_ASCIICODE) + (code.charCodeAt(1) + IBAN_OFFSET_FROM_ASCIICODE);
  }

  /** JS number type can't handle the long account numbers... */
  function modForLargeNumber(base, divider) {
    var div = '';
    for (var i = 0; i < base.length; i++) {
      div = parseInt(div + base[i], 10);
      if (div >= divider) {
        var mod = div % divider;
        if (i == base.length - 1) {
          return mod;
        } else {
          div = mod;
        }
      }
    }
    return parseInt(div, 10);
  }

  var FinnishBusinessUtils = {
    isValidRefNumber: function isValidRefNumber(refNumber) {
      //  Sanity and format check, which allows to make safe assumptions on the format.
      if (!refNumber || typeof refNumber !== 'string' || !REF_NUMBER_REGEX.test(removeAllWhiteSpaces(refNumber))) {
        return false;
      }

      refNumber = removeAllWhiteSpaces(refNumber);
      refNumber = removeLeadingZeros(refNumber);

      var checksum = 0,
          refNumberLengthNoChecksum = refNumber.length - 1,
          checksumNumber = undefined;

      for (var i = 0; i < refNumberLengthNoChecksum; i++) {
        checksum += REF_NUMBER_MULTIPLIERS[i % REF_NUMBER_MULTIPLIERS.length] * parseInt(refNumber.charAt(i), 10);
      }

      checksumNumber = 10 - checksum % 10;

      if (checksumNumber === 10) {
        checksumNumber = 0;
      }
      return checksumNumber === parseInt(refNumber.charAt(refNumberLengthNoChecksum));
    },
    isValidFinnishIBAN: function isValidFinnishIBAN(accountNumber) {
      return this.isValidIBAN(accountNumber) && accountNumber.indexOf('FI') !== -1;
    },
    isValidIBAN: function isValidIBAN(accountNumber) {
      //  quick sanity check against regex, to make parsing safer later
      if (!accountNumber || typeof accountNumber !== 'string' || !FINNISH_IBAN_REGEX.test(removeAllWhiteSpaces(accountNumber))) {
        return false;
      }

      accountNumber = removeAllWhiteSpaces(accountNumber);
      var localAccountNumber = accountNumber.substring(4, 18),
          countryCode = accountNumber.substring(0, 2),
          checksum = accountNumber.substring(2, 4);

      return modForLargeNumber(localAccountNumber + countryCodeToNumber(countryCode) + checksum, 97) === 1;
    },
    generateReferenceNumber: function generateReferenceNumber() {
      return '1234561';
    }
  };

  module.exports = FinnishBusinessUtils;
});

