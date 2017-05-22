'use strict'
const isMod11 = function (kt : string) : boolean {
    //Modulus-aðferð við að sannreyna kennitölu
    //http://www.skra.is/pages/1049
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
const format = function(kt : string | number | null) : string {
    kt = kt || ''
    if (typeof kt === 'number') {
        kt = kt.toString()
    }
    if (kt) {
        kt = kt.replace("-", "")
    }
    if (kt.length === 9) {
        kt = "0" + kt //Stutt kennitala (eða ólögleg), bætum einu núlli fyrir framan.
    }
    return kt
}
export function isValid(kt : string | number) : boolean {
    kt = format(kt)
    if (typeof kt !== 'string' || kt.length < 9 || !kt.match(/^[\d\.]/) || kt === "0000000000") {
        return false
    }
    return isMod11(kt)
}
export function formatAndValidate (kt : string | number | null) : string {
    kt = format(kt)
    if (!isValid(kt)) {
        throw new Error('Invalid kennitala')
    }
    return kt
}

export function getBirthdate (kt : string | number) : Date {
    const stringKt = format(kt);
    let day = Number(stringKt.substring(0,2))
    //if it is company
    if(day>31)
    {
        day = day - 40
    }
    const month = Number(stringKt.substring(2,4))
    //Adding the century year
    const year = (Number(stringKt.substring(9,10)) === 0?2000:1900) + Number(stringKt.substring(4,6))
    if(day>31 || month>12){
      throw new Error('Invalid date of birth')
    }
    return new Date(year,Number(month)-1,day)
}
export function getAge (kt : string | number , referenceDate? : Date) : number {
    referenceDate  = referenceDate  || new Date()
    var ktDate = getBirthdate(kt)
    var refYear = referenceDate. getFullYear()
    var calcDate = new Date(ktDate)
    calcDate.setFullYear(refYear)
    var age = refYear-ktDate.getFullYear()
    if(calcDate > referenceDate) {
        age--
    }
    return age < 1 ? (referenceDate.getTime()- ktDate.getTime())/1000/60/60/24/365.2422 : age
}
export function isKennitalaPart(str? : string) : boolean {
   if (!str) {
        return false
    }
    var s = str.replace(' ','').replace('-','').trim()
    return !isNaN(parseInt(s, 10))
}