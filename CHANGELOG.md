# Changelog

## [6.1.2] - 2026-03-05

### Changed

- **BREAKING**: Removed the mod11 (vartala) validation check from `isValid()`. Kennitölur are no longer validated using the modulus-11 algorithm, as Þjóðskrá discontinued the vartala requirement on February 18, 2026. See: https://www.skra.is/um-okkur/frettir/frett/2025/05/14/Kennitolur-an-vartolu
- `isValid()` now only checks length, format, and whether the month digits are in range (1–12). All kennitölur that pass these basic checks are considered valid, including kerfiskennitölur.

### Internal

- Replaced deprecated `substr()` calls with `substring()`
- Upgraded to dual CommonJS/ESM package output (`dist/cjs/` and `dist/esm/`)
- Added proper `exports` field in `package.json` for modern module resolution
- Modernized dev tooling: replaced mocha/chai with `node:test`/`node:assert`, removed husky, updated eslint config
- Output directory changed from `js/` to `dist/`

## [6.0.0] - 2021-09-02

### Added

- Support for kerfiskennitölur (kennitölur starting with 8 or 9)
- `makeKerfiskennitala()` function to generate kerfiskennitölur
- `isCompany()` now correctly returns false for kerfiskennitölur
- Exception handling for illegal kennitölur from 1969 (Fyrirtækjaskrá foundation year)

## [5.0.0] - 2020-11-18

### Changed

- getBirthdate now throws an Oops error instead of native error if the kennitala has an invalid date

### Removed

- cleanAndValidate
- getCleanIfValid
