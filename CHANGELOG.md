# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.1] - 2025-01-23

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

## [0.0.0] - 2025-01-20

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
