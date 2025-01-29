# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.3] - 2025-01-29

### Changed

Migrated from `bun` to `yarn`. Now, all command processes use `yarn` instead of `bun`.

## [0.0.2] - 2025-01-29

### Added

- Added `cleanFalsy` function and chaining support for `ocx` (`.clean()`).
- Enhanced `ocxMap` type to support functions with an optional key parameter: `((key?: ocxKey) => ocxMap)`, enabling usage like:
  ```ts
  ocx([{}, key => key?.role === 'admin' && { permissions: ['read', 'write', 'delete'] }]);
  ```
- Provided `symbol documentation` for all functions.
- Introduced official documentation: [ilkhoeri.github.io/cretex](https://ilkhoeri.github.io/cretex/).
- Version now available and installable via [JSR](https://jsr.io/@cretex/dynamic).
- Added support for **Deno**.
- Expanded test coverage to ensure all possible return scenarios are validated for each function.

### Changed

- Updated `cnx` function to trim whitespace by modifying:
  ```ts
  inputs.join(' '); // previous
  inputs.join(' ').trim(); // updated
  ```
- Updated `cvx` function to trim whitespace by modifying:

  ```ts
  variants.filter(Boolean).join(' '); // previous
  variants
    .filter(Boolean)
    .join(' ')
    .trim() // updated

    [(keys.assign, variants)].join(' ') // previous
    [(keys.assign, variants)].join(' ')
    .trim(); // updated
  ```

### Removed

- **Removed dependency on `tailwind-merge`**, meaning `cn()` and `merge()` functions are no longer included.
- If needed, users must implement their own `cn` utility as follows:

  ```ts
  import { twMerge } from 'tailwind-merge';
  import { cnx, type cnxValues } from 'cretex';

  export function cn(...merge: cnxValues[]): string {
    return twMerge(cnx(...merge));
  }
  ```

---

## [0.0.1] - 2025-01-25

### Added

- Added build pipeline using **Rollup**, replacing **tsup**.
- Integrated **Babel** and **babel-jest** for ESNext compatibility and testing.
- Configured **Jest** for unit testing all utility functions.
- Set up **Husky** for pre-commit hooks, ensuring code quality with linting and testing.
- Introduced **TSX** for TypeScript execution during development.
- Added global handling for `tailwind-merge` in Rollup configuration to fix warnings during UMD build.

### Changed

- Migrated the build system from **tsup** to **Rollup** for better output customization and support for different module formats (CJS, ESM, UMD).
- Improved overall testing coverage with comprehensive test cases for utility functions:
  - `ocx`
  - `cvx`
  - `merge` and `cn`
  - `converter` utilities (`rem`, `em`, `px`, etc.).
- Updated build targets to include better support for CommonJS and UMD environments.

### Fixed

- Fixed warnings related to unresolved dependencies for `tailwind-merge` during the build process by marking it as an external dependency and defining proper global variables.

---

## [0.0.0] - 2025-01-23

### Added

- Initial release with the following utility functions:
  - `ocx`: For merging objects with flexible input types.
  - `cvx`: For handling class variants with default and dynamic options.
  - `merge` and `cn`: Simplified merging of class names with `tailwind-merge`.
  - `converter` utilities:
    - `rem`, `em`: Converts pixel values to rem/em with optional scaling.
    - `px`: Parses and transforms pixel values to their numerical representation.

### Changed

- Built with **tsup** for streamlined TypeScript bundling.
