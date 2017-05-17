'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const kennitala = require("../");
const chai_1 = require("chai");
describe('kennitala', function () {
    it('isLegalKt should check if a social security number is valid', function () {
        chai_1.expect(kennitala.isLegalKt("1504842359")).to.equal(true);
    });
    it('getWellFormedKt', function () {
        chai_1.expect(kennitala.getWellFormedKt("301794989")).to.equal("0301794989");
        chai_1.expect(kennitala.getWellFormedKt("adfasdf")).to.equal(false);
        chai_1.expect(kennitala.getWellFormedKt(null)).to.equal(false);
        chai_1.expect(kennitala.getWellFormedKt("150484-2359")).to.equal("1504842359");
        chai_1.expect(kennitala.getWellFormedKt("30179-4989")).to.equal("0301794989");
    });
    describe('is kenntala part', function () {
        it('should return false for empty string or undefined', function () {
            chai_1.expect(kennitala.isKennitalaPart('')).to.equal(false);
            chai_1.expect(kennitala.isKennitalaPart()).to.equal(false);
        });
        it('should return true for numbers', function () {
            chai_1.expect(kennitala.isKennitalaPart('123')).to.equal(true);
        });
        it('should return true for numbers with dash or space', function () {
            chai_1.expect(kennitala.isKennitalaPart('123-21')).to.equal(true);
            chai_1.expect(kennitala.isKennitalaPart('123 21 ')).to.equal(true);
        });
        it('should return false for none numbers', function () {
            chai_1.expect(kennitala.isKennitalaPart('asd 12')).to.equal(false);
        });
    });
    describe('what age is the owner of kennitala', function () {
        it('should return the age for kennitala', function () {
            var refDate = new Date(2015, 2, 1);
            chai_1.expect(kennitala.getAge('2903992389', new Date(2017, 2, 28, 7, 22, 1))).to.eq(17);
            chai_1.expect(kennitala.getAge('2903992389', new Date(2017, 2, 29, 7, 22, 1))).to.eq(18);
            chai_1.expect(kennitala.getAge('1504842359', new Date(2015, 3, 14))).to.equal(30);
            chai_1.expect(kennitala.getAge('1504842359', new Date(2015, 3, 15))).to.equal(31);
            chai_1.expect(kennitala.getAge('0408823919', refDate)).to.equal(32);
            chai_1.expect(kennitala.getAge('0709042840', refDate)).to.equal(10);
            chai_1.expect(kennitala.getAge('0102713129', new Date(2017, 1, 1))).to.equal(46);
        });
        it('should return age of company kennitala', function () {
            var refDate = new Date(2015, 3, 1);
            chai_1.expect(kennitala.getAge('5004850519', refDate)).to.equal(29);
            chai_1.expect(kennitala.getAge('5505071960', refDate)).to.equal(7);
        });
        it('should return age of child younger than 1', function () {
            var refDate = new Date(1984, 6, 6);
            chai_1.expect(kennitala.getAge('1504842359', refDate)).to.equal(82 / 365.2422);
            chai_1.expect(kennitala.getAge('3112832359', refDate)).to.equal(188 / 365.2422);
        });
    });
});
//# sourceMappingURL=index.js.map