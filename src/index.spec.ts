import { expect } from 'chai'
import * as kennitala from './'
import exp from 'constants'

describe('kennitala', () => {
  it('should be able to check if kennitala is of a company', () => {
    expect(kennitala.isCompany('5811131290')).to.equal(true)
    expect(kennitala.isCompany("150484-2359drop table('secretTable')")).to.eq(
      false,
    )
    expect(kennitala.isCompany('1234567890')).to.equal(false)
  })
  it('"kerfiskennitölur" should not be company', () => {
    expect(kennitala.isCompany(kennitala.makeKerfiskennitala())).to.eq(false)
  })
  it('isValid should check if a social security number is valid', () => {
    expect(kennitala.isValid('1504842359')).to.equal(true)
    expect(kennitala.isValid(1504842359)).to.equal(true)
    expect(kennitala.isValid(1514842359)).to.equal(false)
  })
  it('"kerfiskennitölur" should pass validation inspite of not following the isMod11 rules', () => {
    expect(kennitala.isValid('892350-1739')).to.equal(true)
    expect(kennitala.isValid('9123123999')).to.equal(true)
    expect(kennitala.isValid(kennitala.makeKerfiskennitala())).to.eq(true)
  })
  it('should clean kennitala', () => {
    expect(
      kennitala.clean("adklæj1015- 9$df123drop table('importantone')4"),
    ).to.equal('0101591234')
    expect(kennitala.clean(1234567890)).to.equal('1234567890')
  })
  it('should add dash to kennitala', () => {
    expect(kennitala.format('1504842359')).to.equal('150484-2359')
    expect(kennitala.format('101842359')).to.equal('010184-2359')
  })
  describe('is kenntala part', () => {
    it('should return false for empty string or undefined', () => {
      expect(kennitala.isKennitalaPart('')).to.equal(false)
      expect(kennitala.isKennitalaPart()).to.equal(false)
    })
    it('should return true for numbers', () => {
      expect(kennitala.isKennitalaPart('123')).to.equal(true)
    })

    it('should return true for numbers with dash or space', () => {
      expect(kennitala.isKennitalaPart('123-21')).to.equal(true)
      expect(kennitala.isKennitalaPart('123 21 ')).to.equal(true)
    })

    it('should return false for none numbers', () => {
      expect(kennitala.isKennitalaPart('asd 12')).to.equal(false)
    })
  })
  describe('what age is the owner of kennitala', () => {
    it('should return the age for kennitala', () => {
      const refDate = new Date(2015, 2, 1)
      expect(
        kennitala.getAge('2903992389', new Date(2017, 2, 28, 7, 22, 1)),
      ).to.eq(17)
      expect(
        kennitala.getAge('2903992389', new Date(2017, 2, 29, 7, 22, 1)),
      ).to.eq(18)
      expect(kennitala.getAge('1504842359', new Date(2015, 3, 14))).to.equal(30)
      expect(kennitala.getAge('1504842359', new Date(2015, 3, 15))).to.equal(31)
      expect(kennitala.getAge('0408823919', refDate)).to.equal(32)
      expect(kennitala.getAge('0709042840', refDate)).to.equal(10)
      expect(kennitala.getAge('0102713129', new Date(2017, 1, 1))).to.equal(46)
      expect(kennitala.getAge('2203710000', new Date(2017, 11, 15))).to.equal(
        46,
      )
    })
    it('should return age of company kennitala', () => {
      const refDate = new Date(2015, 3, 1)
      expect(kennitala.getAge('5004850519', refDate)).to.equal(29)
      expect(kennitala.getAge('5505071960', refDate)).to.equal(7)
    })
    it('should return age of child younger than 1', () => {
      const refDate = new Date(1984, 6, 6)
      expect(kennitala.getAge('1504842359', refDate)).to.equal(82 / 365.2422)
      expect(kennitala.getAge('3112832359', refDate)).to.equal(188 / 365.2422)
    })
  })
  describe('dates', () => {
    // Month is zero based
    const testCases = [
      { date: new Date(1984, 3, 15), kt: '1504842009' },
      { date: new Date(1983, 4, 6), kt: '0605832189' },
      { date: new Date(1936, 0, 8), kt: '0801362189' },
      { date: new Date(1972, 11, 31), kt: '3112722099' },
    ]
    testCases.forEach((data: { date: Date; kt: string }) => {
      it('should make new valid kennitala', () => {
        const kt = kennitala.makeKennitala(data.date)
        expect(kennitala.isValid(kt)).to.eq(true)
        expect(kt).to.eq(data.kt)
      })
    })
  })
  it('should make valid kennitala from random date if no date is passed to make kennitala', () => {
    expect(kennitala.isValid(kennitala.makeKennitala())).to.eq(true)
  })
  it('should verify if kennitala has a valid birthdate', () => {
    expect(kennitala.isValidDate('3106162189')).to.eq(false)
    expect(kennitala.isValidDate('1504842359')).to.eq(true)
    expect(kennitala.isValidDate('2902121239')).to.eq(true)
    expect(kennitala.isValidDate('2902131239')).to.eq(false)
  })
  it('kennitala with invalid month should not be valid', () => {
    expect(kennitala.isValid('590881659')).to.eq(false)
    expect(kennitala.isValid('0590881659')).to.eq(false)
  })
  // Fyrirtækjaskrá vas founded in the year 1969, and when the kennitala system was introduced instead of nemenumber.
  // Some companies did not have a registration date in the database. So they were given kennitala from the foundation year of Fyrirtækjaskrá,
  // but the mistake was made to assum all months had 31 days in that allocation, so some of the kennitölur are illegal.
  it('should make an exception for illegal kennitölur from the year 1969', () => {
    expect(kennitala.isValidDate('6902691111')).to.eq(true)
    expect(kennitala.isValidDate('7002691111')).to.eq(true)
    expect(kennitala.isValidDate('7102691111')).to.eq(true)
    expect(kennitala.isValidDate('7202691111')).to.eq(false)
    expect(kennitala.getBirthdate('6902691111').getTime()).to.eq(
      new Date(1969, 2, 1).getTime(),
    )
    expect(kennitala.getAge('6902691111')).to.eq(54)
    expect(kennitala.isValidDate('7104691111')).to.eq(true)
    expect(kennitala.isValidDate('7204691111')).to.eq(false)
    expect(kennitala.getBirthdate('7104691111').getTime()).to.eq(
      new Date(1969, 4, 1).getTime(),
    )
    expect(kennitala.isValidDate('7106691111')).to.eq(true)
    expect(kennitala.isValidDate('7206691111')).to.eq(false)
    expect(kennitala.getBirthdate('7106691111').getTime()).to.eq(
      new Date(1969, 6, 1).getTime(),
    )
    expect(kennitala.isValidDate('7109691111')).to.eq(true)
    expect(kennitala.isValidDate('7209691111')).to.eq(false)
    expect(kennitala.getBirthdate('7109691111').getTime()).to.eq(
      new Date(1969, 9, 1).getTime(),
    )
    expect(kennitala.isValidDate('7111691111')).to.eq(true)
    expect(kennitala.isValidDate('7211691111')).to.eq(false)
    expect(kennitala.getBirthdate('7111691111').getTime()).to.eq(
      new Date(1969, 11, 1).getTime(),
    )
  })
})
