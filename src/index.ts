import { Oops } from 'oops-error'

const isMod11 = (kt: string): boolean => {
  // Modulus-aðferð við að sannreyna kennitölu
  // https://www.skra.is/einstaklingar/eg-og-fjolskyldan/eg-i-thjodskra/um-kennitolur/
  const mod11 =
    11 -
    ((3 * Number(kt.charAt(0)) +
      2 * Number(kt.charAt(1)) +
      7 * Number(kt.charAt(2)) +
      6 * Number(kt.charAt(3)) +
      5 * Number(kt.charAt(4)) +
      4 * Number(kt.charAt(5)) +
      3 * Number(kt.charAt(6)) +
      2 * Number(kt.charAt(7))) %
      11)
  if (mod11 === 11 && kt.charAt(8) === '0') {
    return true
  }
  if (mod11 !== Number(kt.charAt(8))) {
    return false
  }
  return true
}

const isKerfiskennitala = (kt: string): boolean => {
  return kt[0] === '8' || kt[0] === '9'
}
export function format(kt: string): string {
  kt = clean(kt)
  return kt.substr(0, 6) + '-' + kt.substr(6, 10)
}
function randomDate(start: Date, end: Date) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  )
}
export function makeKerfiskennitala(): string {
  const rand = Math.random()
  return (Math.floor(rand) + 8) * 1000000000 + Math.floor(rand * 100000000) + ''
}
export function makeKennitala(birthdate?: Date): string {
  const dateOfBirth =
    birthdate ||
    randomDate(new Date(new Date().getFullYear() - 60, 1, 1), new Date())
  const digits = [
    Math.floor(dateOfBirth.getDate() / 10),
    dateOfBirth.getDate() % 10,
    Math.floor((dateOfBirth.getMonth() + 1) / 10),
    (dateOfBirth.getMonth() + 1) % 10,
    Math.floor((dateOfBirth.getFullYear() % 100) / 10),
    dateOfBirth.getFullYear() % 10,
    2,
    0,
  ]
  const vartalafunc = (d: number[]) => {
    return (
      11 -
      ((d[0] * 3 +
        d[1] * 2 +
        d[2] * 7 +
        d[3] * 6 +
        d[4] * 5 +
        d[5] * 4 +
        d[6] * 3 +
        d[7] * 2) %
        11)
    )
  }
  const vartala = vartalafunc(digits)
  if (vartala === 11) {
    digits.push(0)
  } else if (vartala === 10) {
    digits[7] = digits[7] + 1
    digits.push(vartalafunc(digits))
  } else {
    digits.push(vartala)
  }
  digits.push(Math.floor((dateOfBirth.getFullYear() / 100) % 10))
  return digits.join('')
}
export function clean(kt?: string | number): string {
  kt = kt || ''
  if (typeof kt === 'number') {
    kt = kt.toString()
  }
  if (kt) {
    kt = kt.replace(/(\D)+/g, '')
  }
  if (kt.length === 9) {
    kt = '0' + kt // Stutt kennitala (eða ólögleg), bætum einu núlli fyrir framan.
  }
  return kt
}
export function isValid(kennitala: string | number): boolean {
  const kt = clean(kennitala)
  if (typeof kt !== 'string' || kt.length < 9 || !kt.match(/^[\d\.]/)) {
    return false
  }
  if (isKerfiskennitala(kt)) {
    return true
  }
  if (
    Number(kt.substr(kt.length - 8, 2)) > 13 ||
    Number(kt.substr(kt.length - 8, 2)) === 0
  ) {
    return false
  }
  return isMod11(kt)
}
export function isValidDate(kt: string | number): boolean {
  const stringKt = clean(kt)
  let day = Number(stringKt.substring(0, 2))
  // if it is company
  if (day > 31) {
    day = day - 40
  }
  const month = Number(stringKt.substring(2, 4))
  // Adding the century year
  const year =
    (Number(stringKt.substring(9, 10)) === 0 ? 2000 : 1900) +
    Number(stringKt.substring(4, 6))
  const date = new Date(year, month - 1, day)

  if (Object.prototype.toString.call(date) === '[object Date]') {
    // exception for companies that were accidentially registered to illegal dates when the kennitala system was introduced.
    if (year === 1969 || year === 1969) {
      if (day > 31) {
        return false
      }
      if (day > 28 && month === 2 && date.getMonth() === 2) {
        return true
      }
      if (
        day > 30 &&
        ((month === 4 && date.getMonth() === 4) ||
          (month === 6 && date.getMonth() === 6) ||
          (month === 9 && date.getMonth() === 9) ||
          (month === 11 && date.getMonth() === 11))
      ) {
        return true
      }
    }
    if (date.getMonth() === month - 1) {
      return true
    }
  }
  return false
}

export function getBirthdate(kt: string | number): Date {
  const stringKt = clean(kt)
  let day = Number(stringKt.substring(0, 2))
  // if it is company
  if (day > 31) {
    day = day - 40
  }
  const month = Number(stringKt.substring(2, 4))
  // Adding the century year
  const year =
    (Number(stringKt.substring(9, 10)) === 0 ? 2000 : 1900) +
    Number(stringKt.substring(4, 6))
  if (!isValidDate(stringKt)) {
    throw new Oops({
      message: 'Invalid date of birth. (kennitala: ' + kt + ')',
      category: 'OperationalError',
      context: { kt },
    })
  }
  return new Date(year, Number(month) - 1, day)
}
export function isCompany(kt: string): boolean {
  const stringKt = clean(kt)
  const day = Number(stringKt.substring(0, 2))
  return day < 80 && day > 31
}
export function getAge(kt: string | number, referenceDate?: Date): number {
  referenceDate = referenceDate || new Date()
  const ktDate = getBirthdate(kt)
  const refYear = referenceDate.getFullYear()
  const calcDate = new Date(ktDate)
  calcDate.setFullYear(refYear)
  let age = refYear - ktDate.getFullYear()
  if (calcDate > referenceDate) {
    age--
  }
  if (age < 0) {
    // þjóðskrá some times registers kennitölur with temporary last digits... add 100 to correct negative age outcome
    return age + 100
  }
  return age < 1
    ? (referenceDate.getTime() - ktDate.getTime()) /
        1000 /
        60 /
        60 /
        24 /
        365.2422
    : age
}
export function isKennitalaPart(str?: string): boolean {
  if (!str) {
    return false
  }
  const s = str.replace(' ', '').replace('-', '').trim()
  return !isNaN(parseInt(s, 10))
}
