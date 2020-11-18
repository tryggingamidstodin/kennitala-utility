Utility functions for icelandic social security numbers (kennitolur).
Written in TypeScript. Compiled javascript is in js/ subfolder.

###### types...

```javascript
export declare function format(kt: string): string;
export declare function makeKennitala(birthdate: Date): string;
export declare function clean(kt?: string | number): string;
export declare function isValid(kt: string | number): boolean;
export declare function cleanAndValidate(kt?: string | number): string;
export declare function isValidDate(kt: string | number): boolean;
export declare function getBirthdate(kt?: string | number): Date;
export declare function getAge(kt: string | number, referenceDate?: Date): number;
export declare function isKennitalaPart(str?: string): boolean;
export declare function isCompany(kt?: string): boolean;
```

## Changes

[changelog.md](https://github.com/tryggingamidstodin/kennitala-utility/blob/master/CHANGELOG.md)
