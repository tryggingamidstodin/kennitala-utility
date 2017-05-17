Written in TypeScript. Compiled javascript is in js/ subfolder

###### checks whether kennitala is legal based on modulus method
```javascript
isLegalKt(kt : string | number) // return boolean
```

###### cleans, checks legality and returnsstring with a length of 10
```javascript
getWellFormedKt (kt : string | number | null) // return boolean | string
```

###### returns date of birth based on kennitala
```javascript
getBirthdate (kt : string | number) // return boolean | Date
```

###### returns current age based on kennitala
```javascript
getAge (kt : string | number , referenceDate? : Date) // return boolean | number
```

###### 
```javascript
function isKennitalaPart(str? : string)  // return boolean
```