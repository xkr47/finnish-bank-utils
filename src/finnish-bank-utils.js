'use strict'

const REF_NUMBER_MULTIPLIERS = [1, 3, 7],
      REF_NUMBER_REGEX = /^(\d{4,20}|RF\d{6,23})$/i,
      FINNISH_IBAN_REGEX = /^FI\d{16}$/,
      IBAN_OFFSET_FROM_ASCIICODE = -55

function removeAllWhiteSpaces(str) {
  return str.replace(/\s+/g, '')
}

function removeLeadingZeros(str) {
  return str.replace(/^0+/, '')
}

function lettersToNumbers(str) {
  return [...str].map(char => {
    if (/\D/.test(char)) {
      return String(char.charCodeAt(0) + IBAN_OFFSET_FROM_ASCIICODE)
    }
    return char
  }).join('')
}

function reverseString(str) {
  return [...str].reverse().join('')
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
  let dividend = ''
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

/** Luhn mod 10 checksum algorithm https://en.wikipedia.org/wiki/Luhn_algorithm */
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

function isValidFinnishBBAN(accountNumber) {
  accountNumber = removeAllWhiteSpaces(accountNumber)
  const
    localAccountNumberWithoutCheckSum = accountNumber.substr(4, 13),
    luhnChecksumChar = parseInt(accountNumber.substr(17, 1), 10)

  return luhnMod10(localAccountNumberWithoutCheckSum) === luhnChecksumChar
}

function isValidIBAN(iban) {
  iban = removeAllWhiteSpaces(iban.toUpperCase())
  const
    prefixAndChecksum = iban.substr(0, 4),
    number = iban.substr(4)

  return modForLargeNumber(lettersToNumbers(number + prefixAndChecksum), 97) === 1
}

const FinnishBankUtils = {

  /**
   * Validate parameter given finnish banking reference number.
   * Allows grouping of numbers with whitespace.
   * @param refNumber - {String} Reference number to parse, for example: 1234 56789 123123
   * @returns {boolean}
   */
  isValidFinnishRefNumber(refNumber) {
    //  Sanity and format check, which allows to make safe assumptions on the format.
    if (!refNumber || typeof refNumber !== 'string' || !REF_NUMBER_REGEX.test(removeAllWhiteSpaces(refNumber.toUpperCase()))) {
      return false
    }

    refNumber = removeAllWhiteSpaces(refNumber.toUpperCase())

    if (/^RF/.test(refNumber)) {
      if (!isValidIBAN(refNumber)) {
        return false
      }
      refNumber = refNumber.substr(4)
    }

    refNumber = removeLeadingZeros(refNumber)

    let checksum = 0,
        refNumberLengthNoChecksum = refNumber.length - 1,
        checksumNumber

    for (let i = 0; i < refNumberLengthNoChecksum; i++) {
      checksum += REF_NUMBER_MULTIPLIERS[i % REF_NUMBER_MULTIPLIERS.length] * parseInt(refNumber.charAt(i), 10)
    }
    checksumNumber = 10 - checksum % 10

    if (checksumNumber === 10) {
      checksumNumber = 0
    }
    return checksumNumber === parseInt(refNumber.charAt(refNumberLengthNoChecksum))
  },

  /**
   * Validate finnish IBAN. Allows grouping of numbers with whitespace.
   *
   * @param accountNumber - {String} Account number to validate: FI 90 800026 2776 1348
   * @returns {boolean}
   */
  isValidFinnishIBAN(accountNumber) {
    if (typeof accountNumber !== 'string' || !FINNISH_IBAN_REGEX.test(removeAllWhiteSpaces(accountNumber.toUpperCase()))) {
      return false
    }

    return isValidFinnishBBAN(accountNumber) && isValidIBAN(accountNumber)
  },

  /**
   * Format finnish reference number. Adds whitespace every 5 or 4 characters
   *
   * @param refNumber - {String} Reference number to format: RF341234561
   * @param separator - {String} Whitespace or other string to be used
   * @returns {string|undefined}
   */
  formatFinnishRefNumber(refNumber, separator = ' ') {
    if (this.isValidFinnishRefNumber(refNumber)) {
      refNumber = removeAllWhiteSpaces(refNumber.toUpperCase())
      if (/^RF/.test(refNumber)) {
        refNumber = refNumber.substr(0, 4) + removeLeadingZeros(refNumber.substr(4))
        return refNumber.replace(/.{4}/g, '$&' + separator).trim()
      } else {
        refNumber = removeLeadingZeros(refNumber)
        return reverseString(reverseString(refNumber).replace(/.{5}/g, '$&' + separator).trim())
      }
    }
  },

  /**
   * Format finnish IBAN. Adds whitespace every 4 characters
   *
   * @param accountNumber - {String} Account number to format: FI9080002627761348
   * @param separator - {String} Whitespace or other string to be used
   * @returns {string|undefined}
   */
  formatFinnishIBAN(accountNumber, separator = ' ') {
    if (this.isValidFinnishIBAN(accountNumber)) {
      accountNumber = removeAllWhiteSpaces(accountNumber.toUpperCase())
      return accountNumber.replace(/.{4}/g, '$&' + separator).trim()
    }
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

    checksumNumber = 10 - checksum % 10
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
  generateFinnishIBAN() {

    const defaultCheckDigit = '00',
          danskeBankOffice = '800026',  //  Use a real bank and office for simplicity
          countryCodeInDigits = lettersToNumbers('FI'),
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

module.exports = Object.freeze(FinnishBankUtils)
