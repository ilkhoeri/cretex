# **cretex**

Dynamically utility for combining different types of values ​​into a single value.

This function is very useful for building style configurations or other properties dynamically by simplifying flexible management based on runtime conditions.

You can find `cretex` in:

[![NPM](https://img.shields.io/npm/v/cretex.svg?logo=npm)](https://www.npmjs.com/package/cretex)

[![JSR](https://jsr.io/badges/@cretex/dynamic)](https://jsr.io/@cretex/dynamic)
[![JSR Score](https://jsr.io/badges/@cretex/dynamic/score)](https://jsr.io/@cretex/dynamic)

## Installation

### Requirements

- TypeScript `4.5+!`
- You must enable `strict` mode in your `tsconfig.json`. This is a best practice for all TypeScript projects.

  ```ts
  // tsconfig.json
  {
    // ...
    "compilerOptions": {
      // ...
      "strict": true
    }
  }
  ```

using [npm](https://www.npmjs.com/package/cretex)

```bash
npm install cretex
```

using [bun](https://bun.sh/docs/cli/add)

```bash
bun add cretex
```

using [pnpm](https://pnpm.io/cli/add)

```bash
pnpm add cretex
```

using [yarn](https://classic.yarnpkg.com/en/package/cretex)

```bash
yarn add cretex
```

# **cnx**

The cnx function is a utility to dynamically combine string class names based on various input types, such as strings, numbers, objects, arrays, or functions.
This function combines various input types and simplifies complex management by producing clean and valid strings.
Useful for dynamically managing string classes in JavaScript or TypeScript applications.

## Syntax

```ts
function cnx(...inputs: cnxValues[]): string;
```

```ts
// allows receiving Arrays, Objects and Functions
cnx(['', baz, (foo as string) !== 'foo' && bar], { '': !props }, '', () => ({ '' }), undefined, [{ '' }, () => ({ '' })]);
```

## How cnx works:

1. **Initialization:** <br />
   An empty array (classes) is used to store valid strings.

2. **Input Iteration:** <br />
   Each item in the `...inputs` parameter (spread operator) is processed with the following logic: <br />

- String or Number: <br />
  Immediately converted to a string and inserted into the array.
- Array: <br />
  Processed recursively using `cnx(...input)` to support nested structures.
- Object: <br />
  Iterate over the keys and values ​​(key-value pairs). If the value is "truthy" (e.g., `true`), the key (class name) is added to the array.
- Function: <br />
  The function is called, and the result is processed recursively using cnx.
- Null, Undefined, or Boolean: <br />
  Ignored, passed without processing.

3. **Output:** <br />
   The collected classes are combined into a space-separated string.

## Example of Usage

### Basic Merging

```ts
cnx('hello', 'world');
// Output: "hello world"

cnx(() => 'there', 'dynamic');
// Output: "there dynamic"

cnx(['extra', 0, false, 'bar']);
// Output: "extra bar"

cnx('hello', true && 'foo', false && 'bar');
// Output: "hello foo"
```

### Complex Merging

```ts
cnx(['foo'], ['', 0, false, 'bar'], [['baz', [['hello'], 'there']]]);
// Output: "foo bar baz hello there"

cnx('foo', [1 && 'bar', { baz: false, bat: null }, ['hello', ['world']]], 'cya');
// Output: "foo bar hello world cya"

cnx('foo', { primary: true, disabled: false }, ['extra', null, undefined], () => 'dynamic');
// Output: "foo primary extra dynamic"

cnx([{ color: 'red', fontSize: '16px' }, () => ({ backgroundColor: 'blue' }), undefined, [{ margin: '10px' }, () => ({ padding: '5px' })]]);
// Output: "color fontSize backgroundColor margin padding"
```

### Ignored Falsy

```ts
cnx(Boolean, Object, undefined, null, '', 0, NaN);
// Output: ""
```

## Advantages

- Makes it easier to manage dynamic CSS classes.
- Logic wrangling of class merging in code.
- Useful in frameworks like React, Vue, or Svelte for changing class conditions.

---

## Merge class tailwind-merge

```ts
import { cnx, type cnxValues } from 'cretex';
import { twMerge } from 'tailwind-merge';

export function cn(...merge: cnxValues[]): string {
  return twMerge(cnx(...merge));
}
```

```ts
cn('bg-black dark:bg-white font-normal', { 'font-medium': true });
```

## IntelliSense

If you are using the vscode editor, enable autocomplete for the [`tailwindcss`](https://tailwindcss.com/docs/editor-setup#intelli-sense-for-vs-code) class using the following command:

1. Install the [`Tailwind CSS IntelliSense`](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) Visual Studio Code extension
2. Add to your [`settings.json`](https://code.visualstudio.com/docs/getstarted/settings):

```json
"tailwindCSS.experimental.classRegex": [
  ["cnx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"],
  ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"],
  ["merge\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"],
],
```

3. Add config to your [.eslintrc.json](https://eslint.org/docs/latest/use/configure/) to [eslint-plugin-tailwindcss](https://www.npmjs.com/package/eslint-plugin-tailwindcss) configuration

```json
{
  "extends": ["prettier", "plugin:tailwindcss/recommended"],
  "plugins": ["tailwindcss"],
  "ignorePatterns": [],
  "rules": {},
  "settings": {
    "tailwindcss": {
      "callees": ["cnx", "cn"],
      "config": "tailwind.config.ts"
    }
  },
  "overrides": []
}
```

<br />

---

---

# **cvx**

The cvx function is a utility for managing string class variants in a structured manner.
It allows combining classes based on a predefined variant configuration, with the option to include default values ​​(`defaultVariants`) and customization based on user input.

## Syntax

```ts
function cvx<T extends cvxKeys>(keys: cvxRecord<T>): (result?: cvxResult<T>) => string;
```

```ts
cvx({
  assign: '', // optional
  variants: {}, // required
  defaultVariants: {} // optional
});
```

## How cvx works:

1. **Merge Variants:** <br />
   The variants provided by the user via `variant` are merged with the default variants (`defaultVariants`), if any.

2. **Determine Class:** <br />
   For each key in `variants`, the function maps the corresponding value from the merged `variant`.

3. **Generate String:** <br />
   The class values ​​are merged into a single space-separated string.
   If `assign` is given, this string is prefixed with the value of `assign`.

## Example of Usage

```tsx
import { cvx, type cvxProps } from 'cretex';

const classes = cvx({
  // assign values that is definitely returned
  assign: 'bg-muted rounded-sm px-2 border flex items-center justify-center',
  variants: {
    variant: {
      light: 'font-light',
      bold: 'font-bold',
      semibold: 'font-semibold'
    },
    effect: {
      italic: 'font-italic'
    },
    color: {
      blue: 'text-blue-600',
      green: 'text-green-700',
      red: 'text-red-500',
      purple: 'text-purple-500'
    },
    size: {
      sm: 'h-4',
      md: 'h-6',
      lg: 'h-10',
      xl: 'h-14'
    }
  },
  // determine the variance value by default
  defaultVariants: {
    variant: 'bold',
    color: 'blue',
    size: 'lg'
  }
});
```

```tsx
type VariantsType = cvxProps<typeof classes>;
// Output:
// type VariantsType = {
//     variant?: "bold" | "light" | "semibold" | undefined;
//     effect?: "italic" | undefined;
//     color?: "blue" | "green" | "red" | "purple" | undefined;
//     size?: "sm" | "md" | "lg" | "xl" | undefined;
// };
```

```tsx
type Color = NonNullable<cvxProps<typeof classes>['color']>;
// Output:
// type Color = "blue" | "green" | "red" | "purple";
```

## Advantages

- Flexibility: <br />
  Supports a wide range of variant combinations.
- Consistency: <br />
  Simplifies class management with a clearly defined structure.
- Efficiency: <br />
  Minimizes duplication of class logic in code.

## IntelliSense

If you are using the vscode editor, enable autocomplete for the [`tailwindcss`](https://tailwindcss.com/docs/editor-setup#intelli-sense-for-vs-code) class using the following command:

1. Install the [`Tailwind CSS IntelliSense`](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) Visual Studio Code extension
2. Add to your [`settings.json`](https://code.visualstudio.com/docs/getstarted/settings):

```json
"tailwindCSS.experimental.classRegex": [
  ["cvx\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
  ["cvx\\(([^)]*)\\)", "(?:'|\"|`)([^'\"`]*)(?:'|\"|`)"],
  ["assign:\\s*['\"`]([^'\"`]*?)['\"`]", "(?:'|\"|`)([^'\"`\\]]*|\\[[^\\]]+\\])(?:'|\"|`)"],
  ["assign:\\s*['\"`]([^'\"`]*?)['\"`]", "(?:^|\\s+)([\\w-:\\[\\].()#\\/%]+)(?=\\s+|$)"],
  ["variants:\\s*\\{([^}]*?)\\}", "(?:'|\"|`)([^'\"`\\]]*|\\[[^\\]]+\\])(?:'|\"|`)"],
  ["variants:\\s*\\{[^}]*?['\"`\\w]+:\\s*['\"`]([^'\"`]*)['\"`]", "(?:^|\\s+)([\\w-:\\[\\].()#\\/%]+)(?=\\s+|$)"],
],
```

[`cva`](https://cva.style/docs) uses the first argument as a constant that will be distributed throughout the variance, in cvx this argument is moved to the `assign` parameter. cvx does not or has not passed the `class` and `className` parameters.

<br />

---

---

# **ocx**

The `ocx` function is a utility for combining different types of values into a single object. This function is very useful for building dynamic configurations or other properties by simplifying flexible management based on runtime conditions. It accepts various input types, such as objects, arrays, functions, or primitive values, and returns an object that combines all relevant properties.

## Syntax

```ts
function ocx<T extends ocxKey>(...obj: ocxObj<T>[]): ocxAcc<T>;
```

Additionally, `ocx` provides a `.clean()` method for filtering out falsy values (e.g., `false`, `undefined`, `null`, `NaN`, `0`) from the resulting object:

```ts
ocx.clean<T extends ocxKey>(...obj: ocxObj<T>[]): ocxAcc<T>;
```

## How `ocx` works:

1. **Input Processing:** <br />

   - Sequentially checks each parameter.
   - If the input is a function, it calls the function and processes the result recursively.
   - If the input is an array, it processes each element recursively.
   - If the input is an object, its properties are merged into the final result.

2. **Output:** <br />

   - Primitive values (e.g., strings, numbers, `null`) are ignored.
   - The final result is an object containing all valid properties from the inputs.

3. **Overwriting Behavior:** <br />

   - Duplicate keys are overwritten by the last input in the list.

4. **Falsy Value Filtering (using `.clean()`):** <br />
   - Removes keys with falsy values (`false`, `undefined`, `null`, `NaN`, `0`).

## Example of Usage

```ts
ocx(
  { a: 1 },
  [{ b: 2 }, { d: 4 }],
  () => ({ c: 3 }),
  key => key?.a && { 'key?.a': key.a === 1 },
  {},
  0, // will be ignored
  'string', // will be ignored
  null, // will be ignored
  NaN // will be ignored
);
// Output: { a: 1, b: 2, d: 4, c: 3, 'key?.a': true }
```

### Using `.clean()`

```ts
const cleaned = ocx.clean({ a: 1, b: { b1: 'b1' }, c: null, d: undefined });
console.log(cleaned);
// Output: { a: 1, b: { b1: 'b1' } }
```

## Real-World Examples

### Dynamic API Response Combination

```ts
const user = { id: 1, name: 'John Doe', role: 'admin' };
const preferences = { theme: 'dark', language: 'en' };
const metadata = { createdAt: '2023-01-01', isActive: true };

// API responses are combined with additional data
const apiResponse = ocx.clean(
  user,
  { preferences, metadata },
  () => ({ timestamp: new Date().toISOString() }),
  key => key?.role === 'admin' && { permissions: ['read', 'write', 'delete'] }
);

console.log('API Response:', apiResponse);
// API Response: {
//   id: 1,
//   name: 'John Doe',
//   role: 'admin',
//   preferences: { theme: 'dark', language: 'en' },
//   metadata: { createdAt: '2023-01-01', isActive: true },
//   timestamp: '2025-01-28T15:59:40.643Z',
//   permissions: [ 'read', 'write', 'delete' ]
// }
```

### Complex Merging of Nested and Dynamic Data

```ts
const target = { a: 1, b: { b0: 'b0', b1: 'b1' } };
const source = { b: { b0: 'b0', b2: 'b2', b3: 'b3' }, e: 4 };
const deepSource = { b: { b4: 'b4', b6: 'b6' }, f: 4 };
const dynamicSource = [
  { f: { f1: 'f1', f2: 'f2' } },
  { g: NaN && 'g0' }, // like this if you want to use the falsy value of key?.g
  !false && { h: { h1: 'h1', h2: 'h2' } }, // like this if you want to get valid value
  true && { f: { f3: 'f3', f1: 'F1' } }
];
const getKeys = (key?: ocxKey) => key && { keys: Object.keys(key) };

console.log(
  'Complex Combined:',
  ocx(
    'ignored',
    target,
    source,
    deepSource,
    () => dynamicSource,
    key => key?.f && { f: { f5: 'F5', f2: 'F2', f1: 'FOO' } },
    getKeys
  )
);
// Complex Combined: {
//   a: 1,
//   b: { b0: 'b0', b1: 'b1', b2: 'b2', b3: 'b3', b4: 'b4', b6: 'b6' },
//   e: 4,
//   f: { f1: 'FOO', f2: 'F2', f3: 'f3', f5: 'F5' },
//   g: NaN,
//   h: { h1: 'h1', h2: 'h2' },
//   keys: [ 'a', 'b', 'e', 'f', 'g', 'h' ]
// }
```

### Complex API Serialization Example

```ts
const data = [
  { id: 1, name: 'Alice', active: true, details: { role: 'user', age: 25 } },
  { id: 2, name: 'Bob', active: false, details: { role: 'moderator', age: 30 } },
  { id: 3, name: 'Charlie', active: true, details: { role: 'admin', age: 35 } }
];

const serialized = data.map(item =>
  ocx.clean(
    item,
    { isAdult: item.details.age >= 18 },
    key => key?.active && { status: 'online' },
    !item.active && { status: 'offline', inactiveSince: '2023-12-01' }
  )
);

console.log(serialized);
// Output:
// [
//   { id: 1, name: 'Alice', active: true, details: { role: 'user', age: 25 }, isAdult: true, status: 'online' },
//   { id: 2, name: 'Bob', details: { role: 'moderator', age: 30 }, isAdult: true, status: 'offline', inactiveSince: '2023-12-01' },
//   { id: 3, name: 'Charlie', active: true, details: { role: 'admin', age: 35 }, isAdult: true, status: 'online' }
// ]
```

## Advantages

- Simplifies dynamic object creation for configurations or API responses.
- Supports deep merging of objects.
- Handles arrays, functions, and dynamic values seamlessly.
- Filters out unnecessary or falsy values when `.clean()` is used.

<br />

---

---

# **rem - em**

rem and em functions are converters for changing values ​​in various formats into values ​​with rem or em units.

## Syntax

```ts
const rem: (value: unknown) => string;
const em: (value: unknown) => string;
```

### Parameters

- `value` (unknown): The value to convert. Can be a number, string, or supported expression (e.g. `calc`, `clamp`).
- Returns: A string containing a value in rem or em units.

### Details:

- If the input is a number, the function divides it by 16 to convert from pixels (px) to rem/em.
- Strings that already have the same units are returned directly unchanged.
- Supports complex strings such as calc, clamp, or a space- or comma-separated list of values.

## Example of Usage

```ts
rem(16);
// Output: "1rem"

em('32px');
// Output: "2em"

rem('calc(100% - 10px)');
// Output: "calc(100% - 0.625rem)"
```

<br />

---

---

# **px**

The px function is used to convert a value to pixels or get a numeric value from a string in pixels, rems, or ems.

## Syntax

```ts
function px(value: unknown): string | number;
```

### Parameters

- **`value` (unknown):** The value to convert. Can be a number or a string.
- **Returns:** <br />
  **If value is a number:** it is returned directly.
  <br />
  **If value is a string:** <br />
  If it contains px units, it is returned as a unitless number.
  If it contains rem or em units, it is converted to pixels assuming 1 rem/em = 16 pixels.
  If it contains an expression such as calc or var, it is returned as a string.

## Example of Usage

```ts
px(16);
// Output: 16

px('1rem');
// Output: 16

px('2em');
// Output: 32

px('calc(100% - 10px)');
// Output: "calc(100% - 10px)"
```

<br />

# **createConverter**

This function is a utility to create a custom converter with specific units. For example, rem and em are created using this function.

## Syntax

```ts
function createConverter(units: string, { shouldScale }?: { shouldScale?: boolean | undefined }): (value: unknown) => string;
```

### Parameters

- `units` (string): <br /> The units used by the converter (e.g. `rem`, `em`).
- `options` (object) (optional): <br />
  `shouldScale` (boolean): Specifies whether the conversion result should be scaled using the scaleRem function.
- **Returns:** <br />
  A converter function that accepts a value to convert to the specified units.

## Example of Usage

```ts
const pt = createConverter('pt');
pt(16);
// Output: "1pt"
```

## Advantages and Optimizations

- `Flexible`: Supports various input formats such as numbers, strings, and complex expressions.
- `High Compatibility`: Can be used for various unit conversion needs in CSS, including responsive units such as rem and em.
- `Advanced Expressions`: Supports operations with calc, clamp, and other CSS functions.
- `Scalability`: The createConverter function allows the creation of custom converters for other units in the future.

<br />

---

---

# **Exported**

## Using Named and Default Exports Together

Our library provides both **named exports** and a **default export** to give you flexibility when importing and using its features. However, when using both export styles together in a project, there are important considerations due to differences in how module systems handle these exports, especially if you're working with different module formats like **ES Modules (ESM)** and **CommonJS (CJS)**.

## **For ES Modules Users**

If you're using an ESM-based environment (e.g., modern browsers, `node` with `"type": "module"`, or build tools like Vite, Webpack, or Rollup with ESM configuration), you can import the library as follows:

1. **Using the default export**:

   ```typescript
   import x from 'cretex';

   // Access functions, types, or properties through the default export
   x.cnx();
   x.cvx();
   x.ocx();
   ```

2. **Using named exports**:

   ```typescript
   import { cnx, cvx, ocx } from 'cretex';

   // Use specific functions or properties directly
   cnx();
   cvx();
   ocx();
   ```

3. **Combining default and named imports**:

   ```typescript
   import x, { cnx } from 'cretex';

   x.cnx(); // Access via default export
   cnx(); // Access directly as a named export
   ```

## **For CommonJS Users**

If you're working in a CommonJS environment (e.g., Node.js with `"type": "commonjs"`), the behavior of default exports changes slightly:

1. **Default export is wrapped in a `default` property**:

   ```javascript
   const x = require('cretex').default;

   // Access functions, types, or properties through the default export
   x.cnx();
   x.cvx();
   x.ocx();
   ```

2. **Using named exports (requires destructuring)**:

   ```javascript
   const { cnx, cvx, ocx } = require('cretex');

   cnx();
   cvx();
   ocx();
   ```

**Why This Behavior?**

This behavior arises because CommonJS and ES Modules have different mechanisms for handling default exports:

- In ES Modules, the `default` export is directly accessible.
- In CommonJS, `default` exports are wrapped in an object (`module.exports`), requiring access via `.default`.

## **How We Recommend Using This Library**

To minimize confusion and ensure compatibility:

- Prefer using **named exports** for better clarity and tree-shaking in ESM.
- Use the **default export** when you need a single namespace object to organize all features of the library.

## **Targeting ES2020**

This library is compiled with **`target: es2020`**, meaning it utilizes modern JavaScript features. Ensure that your environment or build tools support ES2020 syntax or transpile the code if necessary.

---

**Example Table of Imports**

| **Use Case**                | **ESM Import Syntax**                     | **CJS Import Syntax**                                                              |
| --------------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------- |
| Default Export              | `import x from 'cretex';`                 | `const x = require('cretex').default;`                                             |
| Named Exports               | `import { cnx, cvx, ocx } from 'cretex';` | `const { cnx, cvx, ocx } = require('cretex');`                                     |
| Combining Default and Named | `import x, { cnx } from 'cretex';`        | `const x = require('cretex').default;` <br /> `const { cnx } = require('cretex');` |

By understanding these nuances, you can confidently use this library in any environment.

---

# **Links**

[Repository](https://github.com/ilkhoeri/cretex)
[Documentation](https://oeri.vercel.app)

# **License**

[MIT License](./LICENSE)

[© ilkhoeri](https://github.com/ilkhoeri/cretex/blob/main/LICENSE)

# **Others**

[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/ilkhoeri/cretex/test.yml?branch=main&label=Unit%20Tests&style=flat-square)](https://github.com/ilkhoeri/cretex)
[![Test Coverage](https://img.shields.io/codeclimate/coverage/ilkhoeri/cretex?style=flat-square)](https://codeclimate.com/github/ilkhoeri/cretex/test_coverage)
