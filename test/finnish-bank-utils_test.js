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
