'use strict'
const isMod11 = function (kt: string): boolean {
    //Modulus-aðferð við að sannreyna kennitölu
    //https://www.skra.is/einstaklingar/eg-og-fjolskyldan/eg-i-thjodskra/um-kennitolur/
    var mod11 = 11 - ((
        3 * Number(kt.charAt(0)) +
        2 * Number(kt.charAt(1)) +
        7 * Number(kt.charAt(2)) +
        6 * Number(kt.charAt(3)) +
        5 * Number(kt.charAt(4)) +
        4 * Number(kt.charAt(5)) +
        3 * Number(kt.charAt(6)) +
        2 * Number(kt.charAt(7))
    ) % 11)
    if (mod11 === 11 && kt.charAt(8) === '0') {
        return true
    }
    if (mod11 !== Number(kt.charAt(8))) {
        return false
    }
    return true
}
export function format(kt: string): string {
    kt = clean(kt);
    return kt.substr(0, 6) + '-' + kt.substr(6, 10);
}
export function makeKennitala(birthdate: Date): string {
    let digits = [
        Math.floor(birthdate.getDate() / 10),
        birthdate.getDate() % 10,
        Math.floor(birthdate.getMonth() / 10),
        birthdate.getMonth() % 10,
        Math.floor((birthdate.getFullYear() % 100) / 10),
        birthdate.getFullYear() % 10,
        2,
        0
    ]
    let vartalafunc = (digits) => {
        return 11 - (digits[0] * 3 + digits[1] * 2 + digits[2] * 7 + digits[3] * 6 + digits[4] * 5 + digits[5] * 4 + digits[6] * 3 + digits[7] * 2) % 11
    }
    let vartala = vartalafunc(digits)
    if (vartala === 11) {
        digits.push(0)
    } else if (vartala === 10) {
        digits[7] = digits[7] + 1
        digits.push(vartalafunc(digits))
    } else {
        digits.push(vartala)
    }
    digits.push(Math.floor((birthdate.getFullYear() / 100) % 10))
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
        kt = "0" + kt //Stutt kennitala (eða ólögleg), bætum einu núlli fyrir framan.
    }
    return kt
}
export function isValid(kt: string | number): boolean {
    kt = clean(kt)
    if (typeof kt !== 'string' || kt.length < 9 || !kt.match(/^[\d\.]/) || kt === "0000000000") {
        return false
    }
    return isMod11(kt)
}
export function cleanAndValidate(kt?: string | number): string {
    kt = clean(kt)
    if (!isValid(kt)) {
        throw new Error('Invalid kennitala')
    }
    return kt
}
export function getCleanIfValid(kt?: string | number): string {
    kt = clean(kt)
    if (!isValid(kt)) {
        return "";
    }
    return kt
}
export function isValidDate(kt: string | number): boolean {
    const stringKt = clean(kt);
    let day = Number(stringKt.substring(0, 2))
    //if it is company
    if (day > 31) {
        day = day - 40
    }
    const month = Number(stringKt.substring(2, 4))
    //Adding the century year
    const year = (Number(stringKt.substring(9, 10)) === 0 ? 2000 : 1900) + Number(stringKt.substring(4, 6))
    const date = new Date(year, month - 1, day)
    if (Object.prototype.toString.call(date) == '[object Date]' && date.getMonth() === (month - 1)) {
        return true
    }
    return false
}

export function getBirthdate(kt: string | number): Date {
    const stringKt = clean(kt);
    let day = Number(stringKt.substring(0, 2))
    //if it is company
    if (day > 31) {
        day = day - 40
    }
    const month = Number(stringKt.substring(2, 4))
    //Adding the century year
    const year = (Number(stringKt.substring(9, 10)) === 0 ? 2000 : 1900) + Number(stringKt.substring(4, 6))
    if (!isValidDate(stringKt)) {
        throw new Error('Invalid date of birth. (kennitala: ' + kt + ')')
    }
    return new Date(year, Number(month) - 1, day)
}
export function getAge(kt: string | number, referenceDate?: Date): number {
    referenceDate = referenceDate || new Date()
    var ktDate = getBirthdate(kt)
    var refYear = referenceDate.getFullYear()
    var calcDate = new Date(ktDate)
    calcDate.setFullYear(refYear)
    var age = refYear - ktDate.getFullYear()
    if (calcDate > referenceDate) {
        age--
    }
    return age < 1 ? (referenceDate.getTime() - ktDate.getTime()) / 1000 / 60 / 60 / 24 / 365.2422 : age
}
export function isKennitalaPart(str?: string): boolean {
    if (!str) {
        return false
    }
    var s = str.replace(' ', '').replace('-', '').trim()
    return !isNaN(parseInt(s, 10))
}