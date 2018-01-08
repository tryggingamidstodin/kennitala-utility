import * as kennitala from '../src/'
import { expect } from 'chai'

describe('kennitala', function() {
    it('isLegalKt should check if a social security number is valid', function() {
        expect(kennitala.isValid("1504842359")).to.equal(true)
    })
    it('formatAndValidate', function() {
        expect(kennitala.cleanAndValidate("301794989")).to.equal("0301794989")
        expect(() => kennitala.cleanAndValidate("adfasdf")).to.throw('Invalid kennitala')
        expect(() => kennitala.cleanAndValidate()).to.throw('Invalid kennitala');
        expect(kennitala.cleanAndValidate("150484-2359")).to.equal("1504842359")
        expect(kennitala.cleanAndValidate("30179-4989")).to.equal("0301794989")
        expect(() => kennitala.cleanAndValidate('2203710000')).to.throw('Invalid kennitala')
    })
    it('should clean kennitala', function() {
        expect(kennitala.clean("adklæj1015- 9$df123drop table('importantone')4")).to.equal('0101591234')
        expect(kennitala.clean(1234567890)).to.equal('1234567890')
    })
    it('should add dash to kennitala', function() {
        expect(kennitala.format("1504842359")).to.equal("150484-2359")
        expect(kennitala.format('101842359')).to.equal("010184-2359")
    })
    describe('is kenntala part', function() {
        it('should return false for empty string or undefined', function() {
            expect(kennitala.isKennitalaPart('')).to.equal(false)
            expect(kennitala.isKennitalaPart()).to.equal(false)
        })
        it('should return true for numbers', function() {
            expect(kennitala.isKennitalaPart('123')).to.equal(true)
        })

        it('should return true for numbers with dash or space', function() {
            expect(kennitala.isKennitalaPart('123-21')).to.equal(true)
            expect(kennitala.isKennitalaPart('123 21 ')).to.equal(true)
        })

        it('should return false for none numbers', function() {
            expect(kennitala.isKennitalaPart('asd 12')).to.equal(false)
        })
    })
    describe('what age is the owner of kennitala', function() {
        it('should return the age for kennitala', function() {
            var refDate = new Date(2015, 2, 1)
            expect(kennitala.getAge('2903992389', new Date(2017, 2, 28, 7, 22, 1))).to.eq(17)
            expect(kennitala.getAge('2903992389', new Date(2017, 2, 29, 7, 22, 1))).to.eq(18)
            expect(kennitala.getAge('1504842359', new Date(2015, 3, 14))).to.equal(30)
            expect(kennitala.getAge('1504842359', new Date(2015, 3, 15))).to.equal(31)
            expect(kennitala.getAge('0408823919', refDate)).to.equal(32)
            expect(kennitala.getAge('0709042840', refDate)).to.equal(10)
            expect(kennitala.getAge('0102713129', new Date(2017, 1, 1))).to.equal(46)
            expect(kennitala.getAge('2203710000', new Date(2017, 11, 15))).to.equal(46)
        })
        it('should return age of company kennitala', function() {
            var refDate = new Date(2015, 3, 1)
            expect(kennitala.getAge('5004850519', refDate)).to.equal(29)
            expect(kennitala.getAge('5505071960', refDate)).to.equal(7)
        })
        it('should return age of child younger than 1', function() {
            var refDate = new Date(1984, 6, 6)
            expect(kennitala.getAge('1504842359', refDate)).to.equal(82 / 365.2422)
            expect(kennitala.getAge('3112832359', refDate)).to.equal(188 / 365.2422)
        })
    })
    describe('dates', function() {
        // Month is zero based
        [
            { date: new Date(1984, 3, 15), kt: '1504842009'},
            { date: new Date(1983, 4, 6), kt: '0605832189'},
            { date: new Date(1936, 0, 8), kt: '0801362189'},
            { date: new Date(1972, 11, 31), kt: '3112722099'},
        ].forEach( data => {
            it('should make new valid kennitala', () => {
                let kt = kennitala.makeKennitala(data.date)
                expect(kennitala.isValid(kt)).to.eq(true)
                expect(kt).to.eq(data.kt)
            })
        })
    })
    it('should verify if kennitala has a valid birthdate', () => {
        expect(kennitala.isValidDate('3106162189')).to.eq(false);
        expect(kennitala.isValidDate('1504842359')).to.eq(true);
        expect(kennitala.isValidDate('2902121239')).to.eq(true);
        expect(kennitala.isValidDate('2902131239')).to.eq(false);
    })
})
