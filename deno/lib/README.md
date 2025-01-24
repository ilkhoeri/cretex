# cretex

Dynamically utility for combining different types of values ​​into a single value.

This function is very useful for building style configurations or other properties dynamically by simplifying flexible management based on runtime conditions.

- includes tailwind-merge.

<div align="left">
  <a href="https://www.npmjs.com/package/cretex">
    <img src="https://badgen.net/npm/v/cretex" alt="version" />
  </a>
</div>

## Installation

using [npm](https://www.npmjs.com/package/cretex)

```cirru
npm install cretex
```

using [bun](https://bun.sh/docs/cli/add)

```cirru
bun add cretex
```

using [pnpm](https://pnpm.io/cli/add)

```cirru
pnpm add cretex
```

using [yarn](https://classic.yarnpkg.com/en/package/cretex)

```cirru
yarn add cretex
```

# cnx

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

1. Initialization:
   An empty array (classes) is used to store valid strings.

2. Input Iteration:
   Each item in the `...inputs` parameter (spread operator) is processed with the following logic:

- String or Number:
  Immediately converted to a string and inserted into the array.
- Array:
  Processed recursively using `cnx(...input)` to support nested structures.
- Object:
  Iterate over the keys and values ​​(key-value pairs). If the value is "truthy" (e.g., `true`), the key (class name) is added to the array.
- Function:
  The function is called, and the result is processed recursively using cnx.
- Null, Undefined, or Boolean:
  Ignored, passed without processing.

3. Output:
   The collected classes are combined into a space-separated string.

## Example of Usage

```tsx
cnx('hello', 'world');
// Output: "hello world"

cnx(() => 'there', 'dynamic');
// Output: "there dynamic"

cnx(['extra', 0, false, 'bar']);
// Output: "extra bar"

cnx(Boolean, Object, undefined, null, '', 0, NaN);
// Output: ""

cnx('hello', true && 'foo', false && 'bar');
// Output: "hello foo"

cnx(['foo'], ['', 0, false, 'bar'], [['baz', [['hello'], 'there']]]);
// Output: "foo bar baz hello there"

cnx('foo', [1 && 'bar', { baz: false, bat: null }, ['hello', ['world']]], 'cya');
// Output: "foo bar hello world cya"

cnx('foo', { primary: true, disabled: false }, ['extra', null, undefined], () => 'dynamic');
// Output: "foo primary extra dynamic"

cnx([{ color: 'red', fontSize: '16px' }, () => ({ backgroundColor: 'blue' }), undefined, [{ margin: '10px' }, () => ({ padding: '5px' })]]);
// Output: "color fontSize backgroundColor margin padding"
```

## Advantages

- Makes it easier to manage dynamic CSS classes.
- Logic wrangling of class merging in code.
- Useful in frameworks like React, Vue, or Svelte for changing class conditions.

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
      "callees": ["cn", "merge", "twMerge"],
      "config": "tailwind.config.ts"
    }
  },
  "overrides": []
}
```

## Merger

### Merge class

Merge with tailwind-merge

```tsx
import { cnx, type cnxValues } from 'cretex';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: cnxValues[]) {
  return twMerge(cnx(...inputs));
}
```

### Use merge or cn

```tsx
import { merge } from 'cretex';

<div className={merge('bg-black/60 dark:bg-white/60 font-medium border', { 'font-extrabold border-0': true })} />;
```

---

---

# cvx

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

1. Merge Variants:
   The variants provided by the user via `variant` are merged with the default variants (`defaultVariants`), if any.

2. Determine Class:
   For each key in `variants`, the function maps the corresponding value from the merged `variant`.

3. Generate String:
   The class values ​​are merged into a single space-separated string.
   If `assign` is given, this string is prefixed with the value of `assign`.

## Example of Usage

```tsx
import { cvx, twMerge, rem, type cvxProps } from 'cretex';

const classes = cvx({
  // assign values that is definitely returned
  assign: 'bg-muted rounded-sm px-2 border flex items-center justify-center',
  variants: {
    variant: {
      bold: 'font-bold',
      italic: 'font-italic',
      semibold: 'font-semibold',
      light: 'font-light'
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

type VariantsType = cvxProps<typeof classes>;
interface StylesProps extends VariantsType {
  unstyled?: boolean;
  className?: string;
}
export function getStyles(props: StylesProps) {
  const { className, unstyled, ...rest } = props;
  return { className: twMerge(!unstyled && classes({ ...rest }), className) };
}

export function CvxDemo(props: StylesProps) {
  const { className, color, size, variant, unstyled } = props;
  return (
    <div className="flex flex-col gap-4">
      <div {...getStyles(props)} style={{ width: rem(32), height: rem('32px') }}>
        COMPONENT
      </div>
      <div className={classes()}>COMPONENT</div>
      <div className={classes({ color: 'red', size: 'lg' })}>COMPONENT</div>
      <div className={twMerge(classes({ color: 'red', size: 'md' }), 'bg-black/60 dark:bg-white/60 text-white dark:text-black font-extrabold border-0')}>
        COMPONENT
      </div>
    </div>
  );
}
```

## Advantages

- Flexibility: Supports a wide range of variant combinations.
- Consistency: Simplifies class management with a clearly defined structure.
- Efficiency: Minimizes duplication of class logic in code.

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

---

---

# ocx

The ocx function is a utility for combining different types of values ​​into a single object. This function is very useful for building style configurations or other properties dynamically by simplifying flexible management based on runtime conditions.
It can accept various input types, such as objects, arrays, functions, or primitive values, and returns an object that combines all relevant properties.

## Syntax

```ts
function ocx<T extends ocxKey>(...obj: ocxObj<T>[]): ocxAcc<T>;
```

## How ocx works:

1. Check each input from the parameter sequentially.
   If the input is a function, the function is called, and the result is processed recursively.
   If the input is an array, the elements in it are processed recursively.
   If the input is an object, the properties of the object are merged into the final result.

2. Output:
   Primitive values ​​such as strings, numbers, and null are ignored.
   The final result is an object with all the properties of the valid input.

3. Repeated values ​​on the same key are overwritten by the last input in the list.

## Example of Usage

```tsx
ocx({ a: 1 }, { b: 2 });
// Output: { a: 1, b: 2 }

ocx([{ a: 1 }, { b: 2 }]);
// Output: { a: 1, b: 2 }

ocx(() => ({ a: 1 }));
// Output: { a: 1 }

ocx(
  { a: 1 },
  () => ({ b: 2 }),
  [{ c: 3 }, { d: 4 }],
  'ignored', // String will be ignored
  null // Null will be ignored
);
// Output: {"a":1,"b":2,"c":3,"d":4}

ocx<React.CSSProperties>([
  { baz: 'hello', size: !false },
  () => ({ foo: 'world' }),
  undefined,
  [true && { margin: '10px' }, () => ({ padd: '5px', '--index': 0 })],
  false && [{ out: '1px' }, { border: 'cya', '--index': 11 }],
  null,
  [[true && { bar: null, baz: false, qux: 'qux!' }]]
]);
// Output: {"baz":false,"size":true,"foo":"world","margin":"10px","padd":"5px","--index":11,"bar":null,"qux":"qux!"} as `React.CSSProperties & Record<string, any>`
```

## Advantages

- This function is useful for managing style properties dynamically, such as when using a frontend framework with object-based style management.
- Manage object-based configuration structures
- Combine multiple values ​​in a controlled and flexible way

---

---

# rem - em

rem and em functions are converters for changing values ​​in various formats into values ​​with rem or em units.

## Sintaks:

```ts
const rem: (value: unknown) => string;
const em: (value: unknown) => string;
```

### Parameters:

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

---

---

# px

The px function is used to convert a value to pixels or get a numeric value from a string in pixels, rems, or ems.

## Syntax:

```ts
function px(value: unknown): string | number;
```

### Parameters:

- `value` (unknown): The value to convert. Can be a number or a string.
- Returns:
  If value is a number, it is returned directly.

  If value is a string:
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

# createConverter

This function is a utility to create a custom converter with specific units. For example, rem and em are created using this function.

## Syntax:

```ts
function createConverter(units: string, { shouldScale }?: { shouldScale?: boolean | undefined }): (value: unknown) => string;
```

### Parameters:

- `units` (string): The units used by the converter (e.g. `rem`, `em`).
- `options` (object) (optional):
  `shouldScale` (boolean): Specifies whether the conversion result should be scaled using the scaleRem function.
- Returns:
  A converter function that accepts a value to convert to the specified units.

## Example of Usage:

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

---

---

## **Important: Using Named and Default Exports Together**

Our library provides both **named exports** and a **default export** to give you flexibility when importing and using its features. However, when using both export styles together in a project, there are important considerations due to differences in how module systems handle these exports, especially if you're working with different module formats like **ES Modules (ESM)** and **CommonJS (CJS)**.

### **For ES Modules Users**

If you're using an ESM-based environment (e.g., modern browsers, `node` with `"type": "module"`, or build tools like Vite, Webpack, or Rollup with ESM configuration), you can import the library as follows:

1. **Using the default export**:

   ```typescript
   import cretex from 'cretex';

   // Access functions, types, or properties through the default export
   cretex.cnx();
   cretex.twMerge();
   ```

2. **Using named exports**:

   ```typescript
   import { cnx, cvx, twMerge } from 'cretex';

   // Use specific functions or properties directly
   cnx();
   twMerge();
   ```

3. **Combining default and named imports**:

   ```typescript
   import cretex, { cnx } from 'cretex';

   cretex.cnx(); // Access via default export
   cnx(); // Access directly as a named export
   ```

### **For CommonJS Users**

If you're working in a CommonJS environment (e.g., Node.js with `"type": "commonjs"`), the behavior of default exports changes slightly:

1. **Default export is wrapped in a `default` property**:

   ```javascript
   const cretex = require('cretex').default;

   // Access functions, types, or properties through the default export
   cretex.cnx();
   cretex.twMerge();
   ```

2. **Using named exports (requires destructuring)**:

   ```javascript
   const { cnx, twMerge } = require('cretex');

   cnx();
   twMerge();
   ```

### **Why This Behavior?**

This behavior arises because CommonJS and ES Modules have different mechanisms for handling default exports:

- In ES Modules, the `default` export is directly accessible.
- In CommonJS, `default` exports are wrapped in an object (`module.exports`), requiring access via `.default`.

### **How We Recommend Using This Library**

To minimize confusion and ensure compatibility:

- Prefer using **named exports** for better clarity and tree-shaking in ESM.
- Use the **default export** when you need a single namespace object to organize all features of the library.

### **Targeting ES2020**

This library is compiled with **`target: es2020`**, meaning it utilizes modern JavaScript features. Ensure that your environment or build tools support ES2020 syntax or transpile the code if necessary.

---

## Example Table of Imports

| **Use Case**                | **ESM Import Syntax**                    | **CJS Import Syntax**                                                                   |
| --------------------------- | ---------------------------------------- | --------------------------------------------------------------------------------------- |
| Default Export              | `import cretex from 'cretex';`           | `const cretex = require('cretex').default;`                                             |
| Named Exports               | `import { cnx, twMerge } from 'cretex';` | `const { cnx, twMerge } = require('cretex');`                                           |
| Combining Default and Named | `import cretex, { cnx } from 'cretex';`  | `const cretex = require('cretex').default;` <br /> `const { cnx } = require('cretex');` |

By understanding these nuances, you can confidently use this library in any environment.

---

## Links

[Repository](https://github.com/ilkhoeri/cretex)
[Documentation](https://oeri.vercel.app)

## License

MIT License

[© ilkhoeri](https://github.com/ilkhoeri/cretex/blob/main/LICENSE)
