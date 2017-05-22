Utility functions for icelandic social security numbers (kennitolur).
Written in TypeScript. Compiled javascript is in js/ subfolder.

###### types...
```javascript
export declare function format(kt: string | number | null): string;
export declare function isValid(kt: string | number): boolean;
export declare function formatAndValidate(kt: string | number | null): string;
export declare function getBirthdate(kt: string | number): Date;
export declare function getAge(kt: string | number, referenceDate?: Date): number;
export declare function isKennitalaPart(str?: string): boolean;
```
