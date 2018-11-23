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
      11);
  if (mod11 === 11 && kt.charAt(8) === "0") {
    return true;
  }
  if (mod11 !== Number(kt.charAt(8))) {
    return false;
  }
  return true;
};
export function format(kt: string): string {
  kt = clean(kt);
  return kt.substr(0, 6) + "-" + kt.substr(6, 10);
}
export function makeKennitala(birthdate: Date): string {
  const digits = [
    Math.floor(birthdate.getDate() / 10),
    birthdate.getDate() % 10,
    Math.floor((birthdate.getMonth() + 1) / 10),
    (birthdate.getMonth() + 1) % 10,
    Math.floor((birthdate.getFullYear() % 100) / 10),
    birthdate.getFullYear() % 10,
    2,
    0,
  ];
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
    );
  };
  const vartala = vartalafunc(digits);
  if (vartala === 11) {
    digits.push(0);
  } else if (vartala === 10) {
    digits[7] = digits[7] + 1;
    digits.push(vartalafunc(digits));
  } else {
    digits.push(vartala);
  }
  digits.push(Math.floor((birthdate.getFullYear() / 100) % 10));
  return digits.join("");
}
export function clean(kt?: string | number): string {
  kt = kt || "";
  if (typeof kt === "number") {
    kt = kt.toString();
  }
  if (kt) {
    kt = kt.replace(/(\D)+/g, "");
  }
  if (kt.length === 9) {
    kt = "0" + kt; // Stutt kennitala (eða ólögleg), bætum einu núlli fyrir framan.
  }
  return kt;
}
export function isValid(kt: string | number): boolean {
  kt = clean(kt);
  if (
    typeof kt !== "string" ||
    kt.length < 9 ||
    !kt.match(/^[\d\.]/) ||
    kt === "0000000000" ||
    Number(kt.substr(kt.length - 8, 2)) > 13 ||
    Number(kt.substr(kt.length - 8, 2)) === 0
  ) {
    return false;
  }
  return isMod11(kt);
}
export function cleanAndValidate(kt?: string | number): string {
  const cleanKt = clean(kt);
  if (!isValid(cleanKt)) {
    throw new Error("Invalid kennitala: " + kt);
  }
  return cleanKt;
}
export function getCleanIfValid(kt?: string | number): string {
  kt = clean(kt);
  if (!isValid(kt)) {
    return "";
  }
  return kt;
}
export function isValidDate(kt: string | number): boolean {
  const stringKt = clean(kt);
  let day = Number(stringKt.substring(0, 2));
  // if it is company
  if (day > 31) {
    day = day - 40;
  }
  const month = Number(stringKt.substring(2, 4));
  // Adding the century year
  const year =
    (Number(stringKt.substring(9, 10)) === 0 ? 2000 : 1900) +
    Number(stringKt.substring(4, 6));
  const date = new Date(year, month - 1, day);
  if (
    Object.prototype.toString.call(date) === "[object Date]" &&
    date.getMonth() === month - 1
  ) {
    return true;
  }
  return false;
}

export function getBirthdate(kt: string | number): Date {
  const stringKt = clean(kt);
  let day = Number(stringKt.substring(0, 2));
  // if it is company
  if (day > 31) {
    day = day - 40;
  }
  const month = Number(stringKt.substring(2, 4));
  // Adding the century year
  const year =
    (Number(stringKt.substring(9, 10)) === 0 ? 2000 : 1900) +
    Number(stringKt.substring(4, 6));
  if (!isValidDate(stringKt)) {
    throw new Error("Invalid date of birth. (kennitala: " + kt + ")");
  }
  return new Date(year, Number(month) - 1, day);
}
export function isCompany(kt: string): boolean {
  const stringKt = cleanAndValidate(kt);
  const day = Number(stringKt.substring(0, 2));
  return day > 31;
}
export function getAge(kt: string | number, referenceDate?: Date): number {
  referenceDate = referenceDate || new Date();
  const ktDate = getBirthdate(kt);
  const refYear = referenceDate.getFullYear();
  const calcDate = new Date(ktDate);
  calcDate.setFullYear(refYear);
  let age = refYear - ktDate.getFullYear();
  if (calcDate > referenceDate) {
    age--;
  }
  if (age < 0) {
    // þjóðskrá some times registers kennitölur with temporary last digits... add 100 to correct negative age outcome
    return age + 100;
  }
  return age < 1
    ? (referenceDate.getTime() - ktDate.getTime()) /
        1000 /
        60 /
        60 /
        24 /
        365.2422
    : age;
}
export function isKennitalaPart(str?: string): boolean {
  if (!str) {
    return false;
  }
  const s = str
    .replace(" ", "")
    .replace("-", "")
    .trim();
  return !isNaN(parseInt(s, 10));
}
