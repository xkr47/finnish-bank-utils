'use strict';
const finnishBanking = require('../src/finnish-bank-utils'),
      expect = require('chai').expect

describe('finnish-banking', () => {

  describe('#isValidFinnishRefNumber', () => {
    it('Should fail when given empty String', () => {
      expect(finnishBanking.isValidFinnishRefNumber('')).to.equal(false)
    })

    it('Should fail when given undefined', () => {
      expect(finnishBanking.isValidFinnishRefNumber(undefined)).to.equal(false)
    })

    it('Should fail when given null String', () => {
      expect(finnishBanking.isValidFinnishRefNumber(null)).to.equal(false)
    })

    it('Should fail when given too short refnumber (3 chars)', () => {
      expect(finnishBanking.isValidFinnishRefNumber('123')).to.equal(false)
    })

    it('Should fail when given too long refnumber (21 chars)', () => {
      expect(finnishBanking.isValidFinnishRefNumber('123456789012345678901')).to.equal(false)
    })

    it('Should pass when given valid refnumbers', () => {
      const validRefs = ['1234561',
                          '1511890656',
                          '3222190631525115',
                          '1231180652526617',
                          '01030100067175800018',
                          '3004101416423555']
      validRefs.forEach((refNumber) => {
        expect(finnishBanking.isValidFinnishRefNumber(refNumber)).to.equal(true)
      })
    })

    it('Should pass when given valid refnumbers with whitespaces', () => {
      const validRefsWithSpace = ['123456 1',
                                  '15118 90656',
                                  '3 22219 06315 25115',
                                  '1 23118 06525 26617',
                                  '0 10301 00067 17580 0018',
                                  '3 00410 14164 23555']
      validRefsWithSpace.forEach((refNumber) => {
        expect(finnishBanking.isValidFinnishRefNumber(refNumber)).to.equal(true)
      })
    })
  })

  describe('#isValidFinnishIBAN', () => {
    it('Should fail when given empty String', () => {
      expect(finnishBanking.isValidFinnishIBAN('')).to.equal(false)
    })

    it('Should fail when given undefined', () => {
      expect(finnishBanking.isValidFinnishIBAN(undefined)).to.equal(false)
    })

    it('Should fail when given null String', () => {
      expect(finnishBanking.isValidFinnishIBAN(null)).to.equal(false)
    })

    it('Should fail when given non String', () => {
      expect(finnishBanking.isValidFinnishIBAN({})).to.equal(false)
      expect(finnishBanking.isValidFinnishIBAN(Date())).to.equal(false)
      expect(finnishBanking.isValidFinnishIBAN(3)).to.equal(false)
      expect(finnishBanking.isValidFinnishIBAN(['a'])).to.equal(false)
      expect(finnishBanking.isValidFinnishIBAN(NaN)).to.equal(false)
    })

    it('Should fail when given almost valid bank number with nonsense in the end', () => {
      expect(finnishBanking.isValidFinnishIBAN('FI9080002627761348A')).to.equal(false)
    })

    it('Should fail when given almost valid bank number with nonsense in the beginning', () => {
      expect(finnishBanking.isValidFinnishIBAN('AFI9080002627761348')).to.equal(false)
    })

    it('Should pass when given valid bank number', () => {
      const validIBANs = ['FI9080002627761348',
                        'FI2680003710241081',
                        'FI2580003710241099',
                        'FI4880003710241073',
                        'FI0280003710211928',
                        'FI3039390038674263',
                        'FI7839390014047815',
                        'FI2839390030337828',
                        'FI7118203000008391',
                        'FI5415713000030016',
                        'FI0218803500006967']
      validIBANs.forEach((iban) => {
        expect(finnishBanking.isValidFinnishIBAN(iban)).to.equal(true)
      })
    })

    it('Should pass when given valid bank numbers with whitespace separators', () => {
      const validIBANs = ['FI 90 800026 2776 1348',
                        'FI90 800026 27761348']
      validIBANs.forEach((iban) => {
        expect(finnishBanking.isValidFinnishIBAN(iban)).to.equal(true)
      })
    })
  })

  describe('#generateFinnishRefNumber', () => {
    it('Should create valid random reference number with a sample of 10000', () => {
      for (let i = 0; i < 10000; i++) {
        const generated = finnishBanking.generateFinnishRefNumber()
        expect(finnishBanking.isValidFinnishRefNumber(generated)).to.equal(true)
      }
    })
  })

  describe('#generateFinnishIBAN', () => {
    it('Should create valid finnish IBAN number with a sample of 10000', () => {
      for (let i = 0; i < 10000; i++) {
        const generated = finnishBanking.generateFinnishIBAN()
        expect(finnishBanking.isValidFinnishIBAN(generated)).to.equal(true)
      }
    })
  })

})
