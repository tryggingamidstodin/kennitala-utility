import { describe, it } from 'node:test'
import assert from 'node:assert'
import * as kennitala from './'

describe('kennitala', () => {
  it('should be able to check if kennitala is of a company', () => {
    assert.strictEqual(kennitala.isCompany('5811131290'), true)
    assert.strictEqual(
      kennitala.isCompany("150484-2359drop table('secretTable')"),
      false,
    )
    assert.strictEqual(kennitala.isCompany('1234567890'), false)
  })
  it('"kerfiskennitölur" should not be company', () => {
    assert.strictEqual(
      kennitala.isCompany(kennitala.makeKerfiskennitala()),
      false,
    )
  })
  it('isValid should check if a social security number is valid', () => {
    assert.strictEqual(kennitala.isValid('1504842359'), true)
    assert.strictEqual(kennitala.isValid(1504842359), true)
    assert.strictEqual(kennitala.isValid(1514842359), false)
  })
  it('"kerfiskennitölur" should pass validation inspite of not following the isMod11 rules', () => {
    assert.strictEqual(kennitala.isValid('892350-1739'), true)
    assert.strictEqual(kennitala.isValid('9123123999'), true)
    assert.strictEqual(kennitala.isValid(kennitala.makeKerfiskennitala()), true)
  })
  it('should clean kennitala', () => {
    assert.strictEqual(
      kennitala.clean("adklæj1015- 9$df123drop table('importantone')4"),
      '0101591234',
    )
    assert.strictEqual(kennitala.clean(1234567890), '1234567890')
  })
  it('should add dash to kennitala', () => {
    assert.strictEqual(kennitala.format('1504842359'), '150484-2359')
    assert.strictEqual(kennitala.format('101842359'), '010184-2359')
  })
  describe('is kenntala part', () => {
    it('should return false for empty string or undefined', () => {
      assert.strictEqual(kennitala.isKennitalaPart(''), false)
      assert.strictEqual(kennitala.isKennitalaPart(), false)
    })
    it('should return true for numbers', () => {
      assert.strictEqual(kennitala.isKennitalaPart('123'), true)
    })

    it('should return true for numbers with dash or space', () => {
      assert.strictEqual(kennitala.isKennitalaPart('123-21'), true)
      assert.strictEqual(kennitala.isKennitalaPart('123 21 '), true)
    })

    it('should return false for none numbers', () => {
      assert.strictEqual(kennitala.isKennitalaPart('asd 12'), false)
    })
  })
  describe('what age is the owner of kennitala', () => {
    it('should return the age for kennitala', () => {
      const refDate = new Date(2015, 2, 1)
      assert.strictEqual(
        kennitala.getAge('2903992389', new Date(2017, 2, 28, 7, 22, 1)),
        17,
      )
      assert.strictEqual(
        kennitala.getAge('2903992389', new Date(2017, 2, 29, 7, 22, 1)),
        18,
      )
      assert.strictEqual(
        kennitala.getAge('1504842359', new Date(2015, 3, 14)),
        30,
      )
      assert.strictEqual(
        kennitala.getAge('1504842359', new Date(2015, 3, 15)),
        31,
      )
      assert.strictEqual(kennitala.getAge('0408823919', refDate), 32)
      assert.strictEqual(kennitala.getAge('0709042840', refDate), 10)
      assert.strictEqual(
        kennitala.getAge('0102713129', new Date(2017, 1, 1)),
        46,
      )
      assert.strictEqual(
        kennitala.getAge('2203710000', new Date(2017, 11, 15)),
        46,
      )
    })
    it('should return age of company kennitala', () => {
      const refDate = new Date(2015, 3, 1)
      assert.strictEqual(kennitala.getAge('5004850519', refDate), 29)
      assert.strictEqual(kennitala.getAge('5505071960', refDate), 7)
    })
    it('should return age of child younger than 1', () => {
      const refDate = new Date(1984, 6, 6)
      assert.strictEqual(kennitala.getAge('1504842359', refDate), 82 / 365.2422)
      assert.strictEqual(
        kennitala.getAge('3112832359', refDate),
        188 / 365.2422,
      )
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
        assert.strictEqual(kennitala.isValid(kt), true)
        assert.strictEqual(kt, data.kt)
      })
    })
  })
  it('should make valid kennitala from random date if no date is passed to make kennitala', () => {
    assert.strictEqual(kennitala.isValid(kennitala.makeKennitala()), true)
  })
  it('should verify if kennitala has a valid birthdate', () => {
    assert.strictEqual(kennitala.isValidDate('3106162189'), false)
    assert.strictEqual(kennitala.isValidDate('1504842359'), true)
    assert.strictEqual(kennitala.isValidDate('2902121239'), true)
    assert.strictEqual(kennitala.isValidDate('2902131239'), false)
  })
  it('kennitala with invalid month should not be valid', () => {
    assert.strictEqual(kennitala.isValid('590881659'), false)
    assert.strictEqual(kennitala.isValid('0590881659'), false)
  })
  // Fyrirtækjaskrá vas founded in the year 1969, and when the kennitala system was introduced instead of nemenumber.
  // Some companies did not have a registration date in the database. So they were given kennitala from the foundation year of Fyrirtækjaskrá,
  // but the mistake was made to assum all months had 31 days in that allocation, so some of the kennitölur are illegal.
  it('should make an exception for illegal kennitölur from the year 1969', () => {
    assert.strictEqual(kennitala.isValidDate('6902691111'), true)
    assert.strictEqual(kennitala.isValidDate('7002691111'), true)
    assert.strictEqual(kennitala.isValidDate('7102691111'), true)
    assert.strictEqual(kennitala.isValidDate('7202691111'), false)
    assert.strictEqual(
      kennitala.getBirthdate('6902691111').getTime(),
      new Date(1969, 2, 1).getTime(),
    )
    assert.strictEqual(kennitala.getAge('6902691111', new Date(2023, 2, 1)), 54)
    assert.strictEqual(kennitala.isValidDate('7104691111'), true)
    assert.strictEqual(kennitala.isValidDate('7204691111'), false)
    assert.strictEqual(
      kennitala.getBirthdate('7104691111').getTime(),
      new Date(1969, 4, 1).getTime(),
    )
    assert.strictEqual(kennitala.isValidDate('7106691111'), true)
    assert.strictEqual(kennitala.isValidDate('7206691111'), false)
    assert.strictEqual(
      kennitala.getBirthdate('7106691111').getTime(),
      new Date(1969, 6, 1).getTime(),
    )
    assert.strictEqual(kennitala.isValidDate('7109691111'), true)
    assert.strictEqual(kennitala.isValidDate('7209691111'), false)
    assert.strictEqual(
      kennitala.getBirthdate('7109691111').getTime(),
      new Date(1969, 9, 1).getTime(),
    )
    assert.strictEqual(kennitala.isValidDate('7111691111'), true)
    assert.strictEqual(kennitala.isValidDate('7211691111'), false)
    assert.strictEqual(
      kennitala.getBirthdate('7111691111').getTime(),
      new Date(1969, 11, 1).getTime(),
    )
  })
})
