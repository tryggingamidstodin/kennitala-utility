'use strict'
const isMod11 = function (kt : string) {
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
const ktAsString = function(kt : string | number | null) {
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
const validateKtString = function(kt : string) {
    if (typeof kt !== 'string' || kt.length < 9 || !kt.match(/^[\d\.]/) || kt === "0000000000") {
        return false
    }
    return true
}
export function isLegalKt(kt : string | number) {
    kt = ktAsString(kt)
    if (!validateKtString(kt)) {
        return false
    }
    return isMod11(kt)
}
export function getWellFormedKt (kt : string | number | null) {
    kt = ktAsString(kt)
    if (!validateKtString(kt)) {
        return false
    }
    return kt
}

export function getBirthdate (kt : string | number){
    const stringKt = getWellFormedKt(kt)
    if(!stringKt){
      return false
    }
    let day = Number(stringKt.substring(0,2))
    //if it is company
    if(day>31)
    {
        day = day - 40
    }
    const month = Number(stringKt.substring(2,4))
    //Adding the century year
    const year = (Number(stringKt.substring(9,10)) === 0?2000:1900) + Number(stringKt.substring(4,6))
    return new Date(year,Number(month)-1,day)
}
export function getAge (kt : string | number , referenceDate? : Date) {
    referenceDate  = referenceDate  || new Date()
    var ktDate = getBirthdate(kt)
    if(!ktDate){
      return false
    }
    var refYear = referenceDate. getFullYear()
    var calcDate = new Date(ktDate)
    calcDate.setFullYear(refYear)
    var age = refYear-ktDate.getFullYear()
    if(calcDate > referenceDate) {
        age--
    }
    return age < 1 ? (referenceDate.getTime()- ktDate.getTime())/1000/60/60/24/365.2422 : age
}
export function isKennitalaPart(str? : string) {
   if (!str) {
        return false
    }
    var s = str.replace(' ','').replace('-','').trim()
    return !isNaN(parseInt(s, 10))
}