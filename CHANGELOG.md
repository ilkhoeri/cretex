# CHANGELOG

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Be sure to always refer to the latest documentation for the most up-to-date usage guidelines.

---

## [0.0.45] - 2025-02-04

### **Enhancements**

- **Explicit Type on `clean()`**
  Added explicit type annotation for the `seen` parameter in `clean()`, ensuring better type safety and improving developer experience.

### **Documentation**

- **New Documentation Page**
  Introduced a dedicated [**documentation page**](https://ilkhoeri.github.io/cretex/) for improved readability and accessibility.
- **Centralized Examples & Usage**
  All code examples and usage guidelines are now directed to the [**documentation page**](https://ilkhoeri.github.io/cretex/), ensuring consistency and ease of reference.
- **Refined Symbol Documentation**
  Simplified and enhanced symbol documentation for better clarity and maintainability.

### **Summary**

This release focuses on improving type safety, refining documentation, and ensuring a more structured approach to learning and utilizing the library.

---

## [0.0.4] - 2025-01-31

### Changed

#### **Refactored:**

- `ocx`

  - **Improvements:** Covers all scenarios that were present in the `ocx.raw()` implementation, including:

    - **Replaced** `new WeakSet<object>()` with `new WeakMap<object, object>()` to avoid duplicate processing of nested objects and prevent infinite loops.
    - **Created** a separate `merge()` function to make it more modular.
    - **Avoided direct mutation of `acc`** to make it safer and more predictable.
    - **Ensures that processed object references** are not reprocessed.
    - **Supports all previous scenarios** more efficiently.
    - **Supports arrays as input** and processes the elements in the array with recursion.
    - **Supports functions as input** and executes their results to get the objects to merge.
    - **Supports deep object merging** using recursion with [`ocx.raw`](./src/ocx.ts).
    - **Use `Reflect.ownKeys()` to handle `Symbol` property** to avoid losing special keys.
    - **Maintain compatibility with various input types (objects, functions, arrays, symbols, etc.)**

  - **Handling Scheme Comparison**

    | **Scenario**                                        | **Previous**                   | **Update**                          |
    | --------------------------------------------------- | ------------------------------ | ----------------------------------- |
    | **Recursively merge objects**                       | ✅ Yes                         | ✅ Yes, safer                       |
    | **Handle arrays and merge their elements**          | ✅ Yes                         | ✅ Yes, more optimal                |
    | **Run functions as input and merge the results**    | ✅ Yes                         | ✅ Yes, more modular                |
    | **Prevent infinite loops due to cyclic references** | ✅ Yes, `WeakSet` is used      | ✅ Yes, `WeakMap` is more effective |
    | **Handle symbols (`Symbol`) as keys**               | ✅ `Reflect.ownKeys()` is used | ✅ Still used                       |
    | **Use `Reflect.ownKeys()` to handle `Symbol`**      | ⚠️ Sometimes                   | ✅ Always now                       |
    | **Prevent direct mutation on `acc`**                | ⚠️ Happens sometimes           | ✅ Fixed, safer                     |
    | **Avoid reprocessing the same object**              | ❌ Not yet                     | ✅ `WeakMap` ensures this           |
    | **More modular by separating `merge()` function**   | ❌ No separation               | ✅ Yes, more modular                |

  - **Conclusion:**
    **Functionality remains the same as the previous version** but now it is more **optimal**, **secure**, and **easier to maintain**.

  - **Removed:**

    - `.clean()` chaining, as `ocx` now **removes falsy values by default**.

  - **Introduced:**

    - `.raw()` chaining to **preserve falsy values** when needed.
    - `.preserve()` chaining to **preserve root values without overwriting**, only change the value if it does not exist.

  - **Added**:

    - Support handles merging objects containing `Symbol` keys.
    - Support for `Symbol` as object keys in `ocx` and `ocx.raw()`.

  - **Fixed**:

    - Issue where `Symbol` keys were ignored during merging.

### Removed

- **`cleanFalsy`**. Now a **standalone function** as `clean` with **higher flexibility**
  - **Improved**:
    - **Preserves:** `Symbol` keys while still removing falsy values.
    - **implementation:** to use `seen = new WeakSet<object>()` by default, preventing infinite recursion and improving performance.
  - Improved **deep cleaning** for objects, empty objects, arrays, and mixed data structures.
  - Added **new documentation** section for `clean()`.
- **`px`, `rem`, `em`, and `createConverter`** functions are now **Removed**.
  - These functions will no longer be distributed within this package.
  - They are now available via a **separate npm package**: [**`str-merge`**](https://www.npmjs.com/package/str-merge).
  - Users requiring these utilities should install **`str-merge`** separately.

---

## [0.0.3] - 2025-01-29

### Changed

Migrated from `bun` to `yarn`. Now, all command processes use `yarn` instead of `bun`.

---

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
