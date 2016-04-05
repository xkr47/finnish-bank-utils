'use strict'

import FinnishBankUtils from '../src/finnish-bank-utils'
import {expect} from 'chai'


describe('finnish-bank-utils', () => {

  describe('#isValidFinnishRefNumber', () => {
    it('Should fail when given empty String', () => {
      expect(FinnishBankUtils.isValidFinnishRefNumber('')).to.equal(false)
    })

    it('Should fail when given undefined', () => {
      expect(FinnishBankUtils.isValidFinnishRefNumber(undefined)).to.equal(false)
    })

    it('Should fail when given null String', () => {
      expect(FinnishBankUtils.isValidFinnishRefNumber(null)).to.equal(false)
    })

    it('Should fail when given too short refnumber (3 or 7 chars)', () => {
      expect(FinnishBankUtils.isValidFinnishRefNumber('123')).to.equal(false)
      expect(FinnishBankUtils.isValidFinnishRefNumber('RF12345')).to.equal(false)
    })

    it('Should fail when given too long refnumber (21 or 26 chars)', () => {
      expect(FinnishBankUtils.isValidFinnishRefNumber('123456789012345678901')).to.equal(false)
      expect(FinnishBankUtils.isValidFinnishRefNumber('RF123456789012345678901234')).to.equal(false)
    })

    it('Should pass when given valid refnumbers', () => {
      const validRefs = [
        '1234561',
        'RF341234561',
        '1511890656',
        'RF601511890656',
        '3222190631525115',
        '1231180652526617',
        '01030100067175800018',
        'RF031030100067175800018',
        '3004101416423555',
        '77584747906474893225',
        'RF7677584747906474893225'
      ]
      validRefs.forEach(refNumber =>
        expect(FinnishBankUtils.isValidFinnishRefNumber(refNumber)).to.equal(true)
      )
    })

    it('Should pass when given valid refnumbers with whitespaces', () => {
      const validRefsWithSpace = [
        ' 123456 1 ',
        'RF34 1234 561',
        '15118 90656',
        'RF60 1511 8906 56',
        '3 22219 06315 25115',
        '1 23118 06525 26617',
        '0 10301 00067 17580 0018',
        'RF03 1030 1000 6717 5800 018',
        '3 00410 14164 23555',
        '77584 74790 64748 93225',
        'RF76 7758 4747 9064 7489 3225'
      ]
      validRefsWithSpace.forEach(refNumber =>
        expect(FinnishBankUtils.isValidFinnishRefNumber(refNumber)).to.equal(true)
      )
    })

    it('Should fail when given valid non finnish refnumber in international format', () => {
      expect(FinnishBankUtils.isValidFinnishRefNumber('RF97C2H5OH')).to.equal(false)
    })

  })

  describe('#isValidFinnishIBAN', () => {
    it('Should fail when given empty String', () => {
      expect(FinnishBankUtils.isValidFinnishIBAN('')).to.equal(false)
    })

    it('Should fail when given undefined', () => {
      expect(FinnishBankUtils.isValidFinnishIBAN(undefined)).to.equal(false)
    })

    it('Should fail when given null String', () => {
      expect(FinnishBankUtils.isValidFinnishIBAN(null)).to.equal(false)
    })

    it('Should fail when given non String', () => {
      expect(FinnishBankUtils.isValidFinnishIBAN({})).to.equal(false)
      expect(FinnishBankUtils.isValidFinnishIBAN(Date())).to.equal(false)
      expect(FinnishBankUtils.isValidFinnishIBAN(3)).to.equal(false)
      expect(FinnishBankUtils.isValidFinnishIBAN(['a'])).to.equal(false)
      expect(FinnishBankUtils.isValidFinnishIBAN(NaN)).to.equal(false)
    })

    it('Should fail when given almost valid bank number with nonsense in the end', () => {
      expect(FinnishBankUtils.isValidFinnishIBAN('FI9080002627761348A')).to.equal(false)
    })

    it('Should fail when given almost valid bank number with nonsense in the beginning', () => {
      expect(FinnishBankUtils.isValidFinnishIBAN('AFI9080002627761348')).to.equal(false)
    })

    it('Should pass when given valid bank number', () => {
      const validIBANs = [
        'FI9080002627761348',
        'FI2680003710241081',
        'FI2580003710241099',
        'FI4880003710241073',
        'FI0280003710211928',
        'FI3039390038674263',
        'FI7839390014047815',
        'FI2839390030337828',
        'FI7118203000008391',
        'FI5415713000030016',
        'FI0218803500006967'
      ]
      validIBANs.forEach(iban =>
        expect(FinnishBankUtils.isValidFinnishIBAN(iban)).to.equal(true)
      )
    })

    it('Should pass when given valid bank numbers with whitespace separators', () => {
      const validIBANs = [
        'FI 90 800026 2776 1348',
        'FI90 800026 27761348'
      ]
      validIBANs.forEach(iban =>
        expect(FinnishBankUtils.isValidFinnishIBAN(iban)).to.equal(true)
      )
    })
  })

  describe('#formatFinnishRefNumber', () => {
    it('Should return undefined when given empty String', () => {
      expect(FinnishBankUtils.formatFinnishRefNumber('')).to.equal(undefined)
    })

    it('Should return undefined when given undefined', () => {
      expect(FinnishBankUtils.formatFinnishRefNumber(undefined)).to.equal(undefined)
    })

    it('Should return undefined when given null', () => {
      expect(FinnishBankUtils.formatFinnishRefNumber(null)).to.equal(undefined)
    })

    it('Should return undefined when  given too short refnumber (3 or 7 chars)', () => {
      expect(FinnishBankUtils.formatFinnishRefNumber('123')).to.equal(undefined)
      expect(FinnishBankUtils.formatFinnishRefNumber('RF12345')).to.equal(undefined)
    })

    it('Should return undefined when given too long refnumber (21 or 26 chars)', () => {
      expect(FinnishBankUtils.formatFinnishRefNumber('123456789012345678901')).to.equal(undefined)
      expect(FinnishBankUtils.formatFinnishRefNumber('RF123456789012345678901234')).to.equal(undefined)
    })

    it('Should format correctly when given valid refnumbers', () => {
      const refs = {
        '1234561': '12 34561',
        'RF341234561': 'RF34 1234 561',
        '1511890656': '15118 90656',
        'RF60 1511 8906 56': 'RF60 1511 8906 56',
        '3222190631525115': '3 22219 06315 25115',
        '123 118 065 252 661 7': '1 23118 06525 26617',
        '01030100067175800018': '1030 10006 71758 00018',
        'RF031030100067175800018': 'RF03 1030 1000 6717 5800 018',
        '3004101416423555': '3 00410 14164 23555',
        '77584747906474893225': '77584 74790 64748 93225',
        'rf7677584747906474893225': 'RF76 7758 4747 9064 7489 3225'
      }
      Object.keys(refs).forEach(refNumber =>
        expect(FinnishBankUtils.formatFinnishRefNumber(refNumber)).to.equal(refs[refNumber])
      )
    })

  })

  describe('#formatFinnishIBAN', () => {
    it('Should return undefined when given empty String', () => {
      expect(FinnishBankUtils.formatFinnishIBAN('')).to.equal(undefined)
    })

    it('Should return undefined when given undefined', () => {
      expect(FinnishBankUtils.formatFinnishIBAN(undefined)).to.equal(undefined)
    })

    it('Should return undefined when given null', () => {
      expect(FinnishBankUtils.formatFinnishIBAN(null)).to.equal(undefined)
    })

    it('Should return undefined when given non String', () => {
      expect(FinnishBankUtils.formatFinnishIBAN({})).to.equal(undefined)
      expect(FinnishBankUtils.formatFinnishIBAN(Date())).to.equal(undefined)
      expect(FinnishBankUtils.formatFinnishIBAN(3)).to.equal(undefined)
      expect(FinnishBankUtils.formatFinnishIBAN(['a'])).to.equal(undefined)
      expect(FinnishBankUtils.formatFinnishIBAN(NaN)).to.equal(undefined)
    })

    it('Should return undefined when given almost valid bank number with nonsense in the end', () => {
      expect(FinnishBankUtils.formatFinnishIBAN('FI9080002627761348A')).to.equal(undefined)
    })

    it('Should return undefined when given almost valid bank number with nonsense in the beginning', () => {
      expect(FinnishBankUtils.formatFinnishIBAN('AFI9080002627761348')).to.equal(undefined)
    })

    it('Should format correctly when given valid bank number', () => {
      const IBANs = {
        'FI9080002627761348': 'FI90 8000 2627 7613 48',
        'FI 268 000371024 1081': 'FI26 8000 3710 2410 81',
        'FI2580003710241099': 'FI25 8000 3710 2410 99',
        ' FI4880003710241073 ': 'FI48 8000 3710 2410 73',
        'fi0280003710211928': 'FI02 8000 3710 2119 28',
        'FI3039390038674263': 'FI30 3939 0038 6742 63',
        'FI7839390014047815': 'FI78 3939 0014 0478 15',
        'FI2839390030337828': 'FI28 3939 0030 3378 28',
        'FI7118203000008391': 'FI71 1820 3000 0083 91',
        'FI5415713000030016': 'FI54 1571 3000 0300 16',
        'FI0218803500006967': 'FI02 1880 3500 0069 67'
      }
      Object.keys(IBANs).forEach(iban =>
        expect(FinnishBankUtils.formatFinnishIBAN(iban)).to.equal(IBANs[iban])
      )
    })

    it('Should pass when given valid bank numbers with whitespace separators', () => {
      const validIBANs = [
        'FI 90 800026 2776 1348',
        'FI90 800026 27761348'
      ]
      validIBANs.forEach(iban =>
        expect(FinnishBankUtils.isValidFinnishIBAN(iban)).to.equal(true)
      )
    })
  })

  describe('#generateFinnishRefNumber', () => {
    it('Should create valid random reference number with a sample of 10000', () => {
      for (let i = 0; i < 10000; i++) {
        const generated = FinnishBankUtils.generateFinnishRefNumber()
        expect(FinnishBankUtils.isValidFinnishRefNumber(generated)).to.equal(true)
      }
    })
  })

  describe('#generateFinnishIBAN', () => {
    it('Should create valid finnish IBAN number with a sample of 10000', () => {
      for (let i = 0; i < 10000; i++) {
        const generated = FinnishBankUtils.generateFinnishIBAN()
        expect(FinnishBankUtils.isValidFinnishIBAN(generated)).to.equal(true)
      }
    })
  })

})
