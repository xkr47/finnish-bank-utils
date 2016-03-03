"use strict";
const finnishBanking = require("../src/finnish-banking"),
      expect = require("chai").expect

describe("finnish-banking", () => {

  describe("#isValidRefNumber", () => {
    it("Should fail when given empty String", () => {
      expect(finnishBanking.isValidRefNumber('')).to.equal(false)
    })

    it("Should fail when given undefined", () => {
      expect(finnishBanking.isValidRefNumber(undefined)).to.equal(false)
    })

    it("Should fail when given null String", () => {
      expect(finnishBanking.isValidRefNumber(null)).to.equal(false)
    })

    it("Should fail when given too short refnumber (3 chars)", () => {
      expect(finnishBanking.isValidRefNumber('123')).to.equal(false)
    })

    it("Should fail when given too long refnumber (21 chars)", () => {
      expect(finnishBanking.isValidRefNumber('123456789012345678901')).to.equal(false)
    })

    it("Should pass when given valid refnumbers", () => {
      const validRefs = ['1234561',
                          '1511890656',
                          '3222190631525115',
                          '1231180652526617',
                          '01030100067175800018',
                          '3004101416423555']
      validRefs.forEach(function(refNumber) {
        expect(finnishBanking.isValidRefNumber(refNumber)).to.equal(true)
      })
    })

    it("Should pass when given valid refnumbers with whitespaces", () => {
      const   validRefsWithSpace = ['123456 1',
                                      '15118 90656',
                                      '3 22219 06315 25115',
                                      '1 23118 06525 26617',
                                      '0 10301 00067 17580 0018',
                                      '3 00410 14164 23555']
      validRefsWithSpace.forEach(function(refNumber) {
        expect(finnishBanking.isValidRefNumber(refNumber)).to.equal(true)
      })
    })
  })

  describe("#isValidFinnishIBAN", () => {
    it("Should fail when given empty String", () => {
      expect(finnishBanking.isValidIBAN('')).to.equal(false)
    })

    it("Should fail when given undefined", () => {
      expect(finnishBanking.isValidIBAN(undefined)).to.equal(false)
    })

    it("Should fail when given null String", () => {
      expect(finnishBanking.isValidIBAN(null)).to.equal(false)
    })

    it("Should fail when given non String", () => {
      expect(finnishBanking.isValidIBAN({})).to.equal(false)
      expect(finnishBanking.isValidIBAN(Date())).to.equal(false)
      expect(finnishBanking.isValidIBAN(3)).to.equal(false)
      expect(finnishBanking.isValidIBAN(['a'])).to.equal(false)
      expect(finnishBanking.isValidIBAN(NaN)).to.equal(false)
    })

    it("Should pass when given valid bank number", () => {
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
      validIBANs.forEach(function(iban) {
        expect(finnishBanking.isValidFinnishIBAN(iban)).to.equal(true)
      })
    })

    it("Should pass when given valid bank numbers with whitespace separators", () => {
      const validIBANs = ['FI 90 800026 2776 1348',
                        'FI90 800026 27761348']
      validIBANs.forEach(function(iban) {
        expect(finnishBanking.isValidFinnishIBAN(iban)).to.equal(true)
      })
    })

  })

  describe("#generateReferenceNumber", () => {
    it("Should create 7 char ref number when given base length 6", () => {
      expect(finnishBanking.generateReferenceNumber()).to.equal('1234561')
    })
  })

})
