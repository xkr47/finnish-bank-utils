'use strict'

const REF_NUMBER_MULTIPLIERS = [1, 3, 7],
      REF_NUMBER_REGEX =  /[\d]{4,20}/,
      FINNISH_IBAN_REGEX = /^FI[\d]{16}$/,
      GENERIC_IBAN_REGEX = /^[A-Z]{2}[\d]{16}$/,
      IBAN_OFFSET_FROM_ASCIICODE = -55

function removeAllWhiteSpaces(str) {
  return str.replace(/\s+/g, '');
}

function removeLeadingZeros(str) {
  return str.replace(/^0+/, '');
}

function countryCodeToNumber(code) {
  return (code.charCodeAt(0) + IBAN_OFFSET_FROM_ASCIICODE).toString() +
         (code.charCodeAt(1) + IBAN_OFFSET_FROM_ASCIICODE).toString()
}

function randomNumberWithLength(length) {
  let randomNumber = ''
  for (let i = 0; i < length; i++) {
    randomNumber += Math.floor(Math.random() * 9) + 1 //  1...9, because a real number can't begin with zero
  }
  return parseInt(randomNumber, 10)
}

/** JS number type can't handle the long account numbers... */
function modForLargeNumber(base, divisor) {
  let dividend = '';
  for (let i = 0; i < base.length; i++) {
    dividend = parseInt(dividend + base[i], 10)
    if (dividend >= divisor) {
      const remainder = dividend % divisor
      if (i == base.length - 1) {
        return remainder
      } else {
        dividend = remainder
      }
    }
  }
  return parseInt(dividend, 10)
}

/** Luhn mod 10 algorithm https://en.wikipedia.org/wiki/Luhn_algorithm */
function luhnMod10(value) {
  let sum = 0
  for (let i = 0; i < value.length; i++) {
    const multiplier = (i % 2 === 0) ? 2 : 1
    let add = multiplier * parseInt(value[i], 10)
    if (add >= 10) {
      add -= 9
    }
    sum += add
  }
  const mod10 = sum % 10
  return mod10 === 0 ? mod10 : 10 - mod10
}

const FinnishBankingUtils = {

  /**
   * Validate parameter given finnish banking reference number.
   * Allows grouping of numbers with whitespace.
   * @param refNumber - {String} Reference number to parse, for example: 1234 56789 123123
   * @returns {boolean}
   */
  isValidRefNumber(refNumber) {
    //  Sanity and format check, which allows to make safe assumptions on the format.
    if (!refNumber || typeof refNumber !== 'string' || !REF_NUMBER_REGEX.test(removeAllWhiteSpaces(refNumber))) {
      return false
    }

    refNumber = removeAllWhiteSpaces(refNumber)
    refNumber = removeLeadingZeros(refNumber)

    let checksum = 0,
        refNumberLengthNoChecksum = refNumber.length - 1,
        checksumNumber

    for (let i = 0; i < refNumberLengthNoChecksum; i++) {
      checksum += REF_NUMBER_MULTIPLIERS[i % REF_NUMBER_MULTIPLIERS.length] * parseInt(refNumber.charAt(i), 10)
    }

    checksumNumber = 10 - checksum % 10;

    if (checksumNumber === 10) {
      checksumNumber = 0
    }
    return checksumNumber === parseInt(refNumber.charAt(refNumberLengthNoChecksum))
  },

  /**
   * Validate finnish IBAN. Allows grouping of numbers with whitespace.
   * https://fi.wikipedia.org/wiki/IBAN
   *
   * @param accountNumber - {String} Account number to validate: FI 90 800026 2776 1348
   * @returns {boolean}
   */
  isValidFinnishIBAN(accountNumber) {
    if (typeof accountNumber !== 'string' || !FINNISH_IBAN_REGEX.test(removeAllWhiteSpaces(accountNumber))) {
      return false
    }

    accountNumber = removeAllWhiteSpaces(accountNumber)
    const localAccountNumberWithoutCheckSum = accountNumber.substring(4, 17)
    const luhnChecksum = parseInt(accountNumber.substring(17,18), 10)
    if (luhnMod10(localAccountNumberWithoutCheckSum) !== luhnChecksum) {
      return false
    }

    return this.isValidIBAN(accountNumber)
  },

  /**
   * Validate international IBAN. Allows grouping of numbers with whitespace.
   * https://fi.wikipedia.org/wiki/IBAN
   *
   * @param accountNumber - {String} Account number to validate: FI 90 800026 2776 1348
   * @returns {boolean}
   */
  isValidIBAN(accountNumber) {
    //  quick sanity check against regex, to make parsing safer later
    if (typeof accountNumber !== 'string' || !GENERIC_IBAN_REGEX.test(removeAllWhiteSpaces(accountNumber))) {
      return false
    }

    accountNumber = removeAllWhiteSpaces(accountNumber)
    const localAccountNumber = accountNumber.substring(4, 18),
          countryCode = accountNumber.substring(0, 2),
          checksum = accountNumber.substring(2, 4)

    return modForLargeNumber(localAccountNumber +
                             countryCodeToNumber(countryCode) +
                             checksum, 97) === 1
  },

  /**
   * Returns a random reference number that is 10 chars long, including checksum char
   * @returns {String} - For example '1776750586'
   */
  generateFinnishRefNumber() {
    const refNumber = randomNumberWithLength(9).toString()
    let checksum = 0,
        checksumNumber

    for (let i = 0; i < refNumber.length; i++) {
      checksum += REF_NUMBER_MULTIPLIERS[i % REF_NUMBER_MULTIPLIERS.length] * parseInt(refNumber.charAt(i), 10)
    }

    checksumNumber = 10 - checksum % 10;
    if (checksumNumber === 10) {
      checksumNumber = 0
    }
    return refNumber + checksumNumber
  },

  /**
   * Returns a semi-random valid finnish Iban bank account number
   * https://en.wikipedia.org/wiki/International_Bank_Account_Number#Generating_IBAN_check_digits
   * @returns {string} IBAN string, for example FI9080002627761348
   */
  generateFinnishIban() {

    const defaultCheckDigit = '00',
          danskeBankOffice = '800026',  //  Use a real bank and office for simplicity
          countryCodeInDigits = countryCodeToNumber('FI'),
          bankAccount = randomNumberWithLength(7),
          localAccountNumber = danskeBankOffice + bankAccount + luhnMod10(danskeBankOffice + bankAccount)

    const accountNumberCandidate = localAccountNumber +
                                   countryCodeInDigits +
                                   defaultCheckDigit

    const checkDigit = 98 - modForLargeNumber(accountNumberCandidate, 97)
    const checkChars = checkDigit >= 10 ? (checkDigit.toString()) : ('0' + checkDigit)
    return 'FI' + checkChars + localAccountNumber
  }

}

module.exports = FinnishBankingUtils
