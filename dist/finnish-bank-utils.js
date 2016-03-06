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
    return (code.charCodeAt(0) + IBAN_OFFSET_FROM_ASCIICODE).toString() + (code.charCodeAt(1) + IBAN_OFFSET_FROM_ASCIICODE).toString();
  }

  function randomNumberWithLength(length) {
    var randomNumber = '';
    for (var i = 0; i < length; i++) {
      randomNumber += Math.floor(Math.random() * 9) + 1; //  1...9, because a real number can't begin with zero
    }
    return parseInt(randomNumber, 10);
  }

  /** JS number type can't handle the long account numbers... */
  function modForLargeNumber(base, divisor) {
    var dividend = '';
    for (var i = 0; i < base.length; i++) {
      dividend = parseInt(dividend + base[i], 10);
      if (dividend >= divisor) {
        var remainder = dividend % divisor;
        if (i == base.length - 1) {
          return remainder;
        } else {
          dividend = remainder;
        }
      }
    }
    return parseInt(dividend, 10);
  }

  /** Luhn mod 10 checksum algorithm https://en.wikipedia.org/wiki/Luhn_algorithm */
  function luhnMod10(value) {
    var sum = 0;
    for (var i = 0; i < value.length; i++) {
      var multiplier = i % 2 === 0 ? 2 : 1;
      var add = multiplier * parseInt(value[i], 10);
      if (add >= 10) {
        add -= 9;
      }
      sum += add;
    }
    var mod10 = sum % 10;
    return mod10 === 0 ? mod10 : 10 - mod10;
  }

  function isValidFinnishBBAN(accountNumber) {
    accountNumber = removeAllWhiteSpaces(accountNumber);
    var localAccountNumberWithoutCheckSum = accountNumber.substring(4, 17),
        luhnChecksumChar = parseInt(accountNumber.substring(17, 18), 10);

    return luhnMod10(localAccountNumberWithoutCheckSum) === luhnChecksumChar;
  }

  function isValidIBAN(accountNumber) {
    accountNumber = removeAllWhiteSpaces(accountNumber);
    var localAccountNumber = accountNumber.substring(4, 18),
        countryCode = accountNumber.substring(0, 2),
        checksum = accountNumber.substring(2, 4);

    return modForLargeNumber(localAccountNumber + countryCodeToNumber(countryCode) + checksum, 97) === 1;
  }

  var FinnishBankingUtils = {
    isValidFinnishRefNumber: function isValidFinnishRefNumber(refNumber) {
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
      if (typeof accountNumber !== 'string' || !FINNISH_IBAN_REGEX.test(removeAllWhiteSpaces(accountNumber))) {
        return false;
      }

      return isValidFinnishBBAN(accountNumber) && isValidIBAN(accountNumber);
    },
    generateFinnishRefNumber: function generateFinnishRefNumber() {
      var refNumber = randomNumberWithLength(9).toString();
      var checksum = 0,
          checksumNumber = undefined;

      for (var i = 0; i < refNumber.length; i++) {
        checksum += REF_NUMBER_MULTIPLIERS[i % REF_NUMBER_MULTIPLIERS.length] * parseInt(refNumber.charAt(i), 10);
      }

      checksumNumber = 10 - checksum % 10;
      if (checksumNumber === 10) {
        checksumNumber = 0;
      }
      return refNumber + checksumNumber;
    },
    generateFinnishIBAN: function generateFinnishIBAN() {

      var defaultCheckDigit = '00',
          danskeBankOffice = '800026',
          //  Use a real bank and office for simplicity
      countryCodeInDigits = countryCodeToNumber('FI'),
          bankAccount = randomNumberWithLength(7),
          localAccountNumber = danskeBankOffice + bankAccount + luhnMod10(danskeBankOffice + bankAccount);

      var accountNumberCandidate = localAccountNumber + countryCodeInDigits + defaultCheckDigit;

      var checkDigit = 98 - modForLargeNumber(accountNumberCandidate, 97);
      var checkChars = checkDigit >= 10 ? checkDigit.toString() : '0' + checkDigit;
      return 'FI' + checkChars + localAccountNumber;
    }
  };

  module.exports = FinnishBankingUtils;
});

