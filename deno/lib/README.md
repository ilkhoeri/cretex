<details>
<summary><h1>Table of Contents</h1></summary>

- [**Introduction**](#introduction)
  - [Installation](#installation)
    - [Requirements](#requirements)
- [**cnx**](#cnx)
  - [Syntax](#syntax)
  - [How `cnx` works:](#how-cnx-works)
  - [Example Usage](#example-usage)
    - [Basic Merging](#basic-merging)
    - [Complex Merging](#complex-merging)
    - [Ignored Falsy](#ignored-falsy)
  - [Advantages](#advantages)
  - [Merge class tailwind-merge](#merge-class-tailwind-merge)
  - [IntelliSense](#intellisense)
- [**cvx**](#cvx)
  - [Syntax](#syntax-1)
  - [How `cvx` works:](#how-cvx-works)
  - [Example Usage](#example-usage-1)
  - [Advantages](#advantages-1)
  - [IntelliSense](#intellisense-1)
- [**ocx**](#ocx)
  - [Syntax](#syntax-2)
  - [How `ocx` works:](#how-ocx-works)
  - [Example Usage](#example-usage-2)
    - [Merging Objects](#merging-objects)
  - [Real-World Examples](#real-world-examples)
    - [Dynamic API Response Combination](#dynamic-api-response-combination)
    - [Complex API Response Combination with additional data](#complex-api-response-combination-with-additional-data)
    - [Complex Merging of Nested and Dynamic Data](#complex-merging-of-nested-and-dynamic-data)
    - [Complex API Serialization Example](#complex-api-serialization-example)
  - [Handling `Symbol` Keys in `ocx`](#handling-symbol-keys-in-ocx)
    - [Why Use `Symbol`?](#why-use-symbol)
    - [Example Usage with `Symbol`](#example-usage-with-symbol)
      - [1. `Symbol` as Object Keys](#1-symbol-as-object-keys)
      - [2. Merging Objects with `Symbol`](#2-merging-objects-with-symbol)
      - [3. Deep Merging with `Symbol`](#3-deep-merging-with-symbol)
      - [4. `Symbol` in Nested Objects](#4-symbol-in-nested-objects)
      - [5. `Symbol` in Node.js (`util.inspect.custom`)](#5-symbol-in-nodejs-utilinspectcustom)
  - [Advantages](#advantages-2)
- [**cleanFalsy**](#cleanfalsy)
  - [Syntax](#syntax-3)
    - [How `cleanFalsy()` Works](#how-cleanfalsy-works)
  - [Example Usage](#example-usage-3)
    - [Removing Falsy Values from an Object](#removing-falsy-values-from-an-object)
    - [Removing Falsy Values from Arrays](#removing-falsy-values-from-arrays)
    - [Preserving Certain Falsy Values](#preserving-certain-falsy-values)
    - [Cleaning Nested Objects](#cleaning-nested-objects)
    - [Cleaning Arrays](#cleaning-arrays)
    - [Excluding Specific Values](#excluding-specific-values)
  - [Advantages](#advantages-3)
- [**rem - em**](#rem---em)
  - [Syntax](#syntax-4)
    - [Parameters](#parameters)
    - [Details:](#details)
  - [Example Usage](#example-usage-4)
- [**px**](#px)
  - [Syntax](#syntax-5)
    - [Parameters](#parameters-1)
  - [Example Usage](#example-usage-5)
- [**createConverter**](#createconverter)
  - [Syntax](#syntax-6)
    - [Parameters](#parameters-2)
  - [Example Usage](#example-usage-6)
  - [Advantages and Optimizations](#advantages-and-optimizations)
- [**Exported**](#exported)
  - [Using Named and Default Exports Together](#using-named-and-default-exports-together)
  - [**For ES Modules Users**](#for-es-modules-users)
  - [**For CommonJS Users**](#for-commonjs-users)
  - [**How We Recommend Using This Library**](#how-we-recommend-using-this-library)
  - [**Targeting ES2020**](#targeting-es2020)
- [**Links**](#links)
- [**License**](#license)
- [**Others**](#others)

</details>

# **Introduction**

Cretex is function is very useful for building style configurations, API Response Combination, Complex API Serialization or other properties dynamically by simplifying flexible management based on runtime conditions.

---

> Dynamically utility for combining different types of values ​​into a single value.

---

You can find `cretex` in:

[![NPM](https://img.shields.io/npm/v/cretex.svg?logo=npm&logoColor=white&labelColor=cc3534)](https://www.npmjs.com/package/cretex)
[![JSR](https://jsr.io/badges/@cretex/dynamic?label=jsr)](https://jsr.io/@cretex/dynamic)
[![DENO](https://img.shields.io/npm/v/cretex.svg?logo=deno&logoColor=white&logoSize=auto&label=%20deno&labelColor=blue&color=white)](https://deno.land/x/cretex)
[![jsdelivr](https://img.shields.io/npm/v/cretex.svg?logo=jsdelivr&label=jsdelivr&color=fdC72e)](https://www.jsdelivr.com/package/npm/cretex)

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

using [cdn](https://www.jsdelivr.com/package/npm/cretex)

```html
<!-- default -->
<script src="https://cdn.jsdelivr.net/npm/cretex@0.0.3/lib/index.min.js"></script>

<!-- esm -->
<script type="module">
  import cretex from https://cdn.jsdelivr.net/npm/cretex@0.0.3/+esm
</script>
```

# **cnx**

The `cnx` function is a utility to dynamically combine string class names based on various input types, such as strings, numbers, objects, arrays, or functions.
This function combines various input types and simplifies complex management by producing clean and valid strings.
Useful for dynamically managing string classes in JavaScript or TypeScript applications.

## Syntax

```ts
function cnx(...inputs: cnxValues[]): string;
```

## How `cnx` works:

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

## Example Usage

```ts
// allows receiving Arrays, Objects and Functions
cnx(['', baz, (foo as string) !== 'foo' && bar], { '': !props }, '', () => ({ '' }), undefined, [{ '' }, () => ({ '' })]);
```

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

✅ Makes it easier to manage dynamic CSS classes.
✅ Logic wrangling of class merging in code.
✅ Useful in frameworks like React, Vue, or Svelte for changing class conditions.

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

3. Add config to your [eslint.config.js](https://eslint.org/docs/latest/use/configure/configuration-files) to [eslint-plugin-tailwindcss](https://www.npmjs.com/package/eslint-plugin-tailwindcss) configuration

```js
export default [
  {
    extends: ['prettier', 'plugin:tailwindcss/recommended'],
    plugins: ['tailwindcss'],
    ignorePatterns: [],
    rules: {},
    settings: {
      tailwindcss: {
        callees: ['cnx', 'cn'],
        config: 'tailwind.config.ts'
      }
    },
    overrides: []
  }
];
```

<br />

---

---

# **cvx**

The `cvx` function is a utility for managing string class variants in a structured manner.
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

## How `cvx` works:

1. **Merge Variants:** <br />
   The variants provided by the user via `variant` are merged with the default variants (`defaultVariants`), if any.

2. **Determine Class:** <br />
   For each key in `variants`, the function maps the corresponding value from the merged `variant`.

3. **Generate String:** <br />
   The class values ​​are merged into a single space-separated string.
   If `assign` is given, this string is prefixed with the value of `assign`.

## Example Usage

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

✅ **Flexibility:** <br />
Supports a wide range of variant combinations.
✅ **Consistency:** <br />
Simplifies class management with a clearly defined structure.
✅ **Efficiency:** <br />
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

Additionally, `ocx` provides a `.raw()` method that performs deep merging **without removing falsy values**:

```ts
function ocx.raw<T extends ocxKey>(...obj: ocxObj<T>[]): ocxAcc<T>;
```

## How `ocx` works:

1. **Input Processing:** <br />

   - Sequentially checks each parameter.
   - If the input is a function, it calls the function and processes the result recursively.
   - If the input is an array, it processes each element recursively.
   - If the input is an object, its properties are merged into the final result.

2. **Output:** <br />

   - Primitive values (e.g., `strings`, `numbers`, `null`) are ignored.
   - The final result is an object containing all valid properties from the inputs.

3. **Overwriting Behavior:** <br />

   - Duplicate keys are overwritten by the last input in the list.

4. **Falsy Value Filtering (Default `ocx()` Behavior):** <br />

   - Automatically removes keys with falsy values (`false`, `undefined`, `null`, `NaN`).

5. **Retaining Falsy Values (`ocx.raw()`):** <br />
   - If you need to **keep falsy values while merging**, use `ocx.raw()`.

## Example Usage

```ts
ocx(
  { a: 1 },
  [{ b: 2 }, { d: 4, e: null }, { f: undefined, g: NaN }],
  () => ({ c: 3 }),
  key => key?.a && { 'key?.a': key.a === 1 },
  {},
  0, // will be ignored
  'string', // will be ignored
  null, // will be ignored
  NaN // will be ignored
);
// { a: 1, b: 2, d: 4, c: 3, 'key?.a': true }
```

### Merging Objects

- Default behavior

```ts
const result = ocx({ name: 'John', age: null }, { age: 30, city: 'New York' }, () => ({ country: 'USA' }));
console.log(result);
// { name: "John", age: 30, city: "New York", country: "USA" }
```

```ts
const dynamic = (prev: ocxKey) => prev?.a && { e: prev.a + 5 };
const result = ocx([{ a: 1 }], [{ b: 2 }, { c: 3 }], { d: 4 }, dynamic);
console.log(result); // { a: 1, b: 2, c: 3, d: 4, e: 6 }
```

- Chaining
  - `.raw()`

```ts
const result = ocx.raw({ enabled: false, features: { darkMode: true } }, { features: { darkMode: null, betaMode: true } });

console.log(result);
// { enabled: false, features: { darkMode: null, betaMode: true } }
```

## Real-World Examples

### Dynamic API Response Combination

```ts
const userBase = () => ({
  id: 123,
  name: 'Alice',
  email: 'alice@example.com',
  settings: { theme: 'light', notifications: true }
});

const userOverride = {
  email: null, // This will be removed in ocx()
  settings: { notifications: false }
};

const response = ocx(userBase, userOverride);

console.log(response);
// { id: 123, name: 'Alice', settings: { theme: 'light' } }
```

### Complex API Response Combination with additional data

```ts
const user = {
  id: '1ab2C3',
  username: 'johndoe92',
  email: 'johndoe@example.com',
  role: 'admin',
  colors: 'red-navy',
  profile: {
    age: 32,
    name: { first: 'Johnathan', last: 'Doe' },
    gender: 'male',
    phone: '+1-555-987-6543',
    avatar: 'https://example.com/avatars/johndoe99.png',
    bio: 'Software engineer and technology enthusiast who loves coding and open-source projects.',
    education: [
      { degree: 'BSc Computer Science', institution: 'MIT', yearGraduated: 2014 },
      { degree: 'MSc Artificial Intelligence', institution: 'Stanford University', yearGraduated: 2016 }
    ],
    workExperience: [
      { company: 'Google', role: 'Software Engineer', startDate: '2016-07-01', endDate: '2019-06-30' },
      { company: 'OpenAI', role: 'Lead Developer', startDate: '2019-07-01', endDate: 'Present' }
    ],
    skills: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'AI', 'Machine Learning']
  },
  address: {
    street: '1234 Elm Street',
    city: 'Los Angeles',
    state: 'California',
    country: 'USA',
    zipCode: '90001',
    geo: { lat: 34.0522, lng: -118.2437 }
  },
  socialLink: {
    twitter: '@johndoe',
    linkedIn: 'https://linkedin.com/in/johndoe',
    github: 'https://github.com/johndoe'
  },
  status: 'verified',
  createdAt: '2022-12-15T08:45:00Z',
  lastLogin: '2025-01-30T14:32:00Z',
  lastIp: '192.168.1.100',
  twoFactorAuth: {
    enabled: true,
    methods: ['authenticator_app', 'sms', 'whatsapp', 'email'],
    lastUpdated: '2024-09-20T13:15:00Z'
  },
  activityHistory: [
    { action: 'login', timestamp: '2025-01-30T14:32:00Z', device: 'iPhone 15 Plus', ip: '192.168.1.10' },
    { action: 'update_profile', timestamp: '2025-01-28T10:12:00Z', changes: ['email', 'phone'] },
    { action: 'reset_password', timestamp: '2025-01-20T18:45:00Z', method: 'email_link' }
  ],
  securityAlerts: [
    { event: 'suspicious_login', timestamp: '2025-01-15T22:45:00Z', location: 'Russia', status: 'blocked' },
    { event: 'password_reset_request', timestamp: '2025-01-20T10:00:00Z', method: 'email', status: 'approved' }
  ],
  notifications: {
    email: true,
    push: true,
    sms: false,
    newsletter: false,
    weeklyReport: true,
    productUpdates: false,
    appUpdates: true,
    securityAlerts: true
  },
  sessions: {
    web: { active: true, lastLogin: '2025-01-30T14:32:00Z', ip: '192.168.1.100' },
    windowsApp: { active: false, lastLogin: '2024-12-15T08:45:00Z' },
    mobileApp: { active: true, lastLogin: '2025-01-28T11:12:00Z', device: 'iPhone 15 Plus' }
  },
  organizations: [{ id: 'org-001', name: 'Tech Innovators Inc.', role: 'Lead Developer', joinedAt: '2023-03-01T09:00:00Z' }],
  affiliations: [{ id: 'aff-001', name: 'Open Source Community', role: 'Contributor', since: '2021-06-10T12:00:00Z' }],
  enterprises: [{ id: 'ent-001', name: 'Global Tech Solutions', role: 'Consultant', since: '2022-01-15T08:00:00Z' }],
  replies: [{ id: 'reply-001', content: 'I totally agree with this!', timestamp: '2025-01-29T14:20:00Z' }],
  historyLog: [{ action: 'profile_update', timestamp: '2025-01-28T10:12:00Z', details: ['email', 'phone'] }],
  securityLog: [{ event: 'failed_login_attempt', timestamp: '2025-01-29T18:00:00Z', ip: '192.168.1.50' }]
};

const preferences = {
  theme: 'dark',
  lang: 'en-US',
  timezone: 'America/Los_Angeles',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
  accessibility: {
    textSize: 'medium',
    contrastMode: 'high',
    voiceAssistance: false,
    textToSpeech: true,
    dyslexiaFont: false,
    keyboardNavigation: true
  },
  integrations: {
    googleDrive: { enabled: true, lastSync: '2025-01-15T09:00:00Z' },
    dropbox: { enabled: false },
    slack: { enabled: true, lastSync: '2025-01-10T12:30:00Z' }
  },
  shortcuts: [
    { key: 'ctrl + k', action: 'Open search bar' },
    { key: 'ctrl + n', action: 'Create new document' },
    { key: 'ctrl + s', action: 'Save current work' }
  ]
};

const metadata = {
  createdAt: '2023-01-01T10:00:00Z',
  latestUpdated: '2025-01-01T12:45:00Z',
  isActive: false,
  isPremium: true,
  accountType: 'business',
  subscription: {
    plan: 'Pro',
    startedAt: '2023-02-15T09:00:00Z',
    expiresAt: '2026-02-15T09:00:00Z',
    autoRenew: true,
    paymentMethod: 'credit_card',
    lastPaymentDate: '2025-02-01T08:30:00Z',
    invoices: [
      { id: 'INV-001', date: '2024-01-15', amount: 299.99, status: 'Paid' },
      { id: 'INV-002', date: '2025-01-15', amount: 299.99, status: 'Pending' }
    ],
    usageStats: {
      storageUsed: '150GB',
      apiCalls: 12500,
      lastBillingCycle: '2025-01-01T00:00:00Z'
    }
  },
  security: {
    lastPasswordChange: '2024-10-10T10:10:00Z',
    failedLoginAttempts: 2,
    passwordStrength: 'strong',
    recovery: {
      email: 'recovery@example.com',
      phone: '+1-202-555-0199',
      whatsapp: '+1-202-555-0199',
      securityQuestions: [
        { question: 'What’s your mother’s maiden name?', answerHash: 'a7b8c9d10e' },
        { question: 'What was your first pet’s name?', answerHash: 'f2g3h4i5j6' }
      ]
    }
  },
  devices: [
    {
      merk: 'iPhone 15 Plus',
      brand: 'apple',
      model: 'A2896',
      os: 'iOS 17.2',
      method: 'qrcode',
      registeredAt: '2024-12-15T08:30:00Z',
      ipAddress: '192.168.1.12',
      location: { country: 'USA', city: 'Los Angeles', geo: { lat: 34.0522, lng: -118.2437 } },
      lastActive: '2025-01-29T22:15:00Z',
      status: 'trusted'
    },
    {
      merk: 'ASUS ROG Phone 8',
      brand: 'android',
      model: 'ZS675KS',
      os: 'Android 14',
      method: 'passkey',
      registeredAt: '2023-11-20T16:20:00Z',
      ipAddress: '172.16.254.3',
      location: { country: 'USA', city: 'San Francisco', geo: { lat: 37.7749, lng: -122.4194 } },
      lastActive: '2025-01-25T18:05:00Z',
      status: 'pending_review'
    },
    {
      merk: 'MacBook Pro 16"',
      brand: 'apple',
      model: 'M3 Max',
      os: 'macOS Sonoma',
      method: 'password',
      registeredAt: '2023-09-10T14:10:00Z',
      ipAddress: '192.168.1.20',
      location: { country: 'USA', city: 'New York', geo: { lat: 40.7128, lng: -74.006 } },
      lastActive: '2025-01-30T09:15:00Z',
      status: 'trusted'
    }
  ],
  accessedApps: [
    { name: 'VS Code', lastUsed: '2025-01-29T22:10:00Z' },
    { name: 'GitHub', lastUsed: '2025-01-30T09:00:00Z' },
    { name: 'Slack', lastUsed: '2025-01-28T15:45:00Z' }
  ]
};

const updated = {
  notifications: {
    email: { enabled: true, frequency: 'daily', categories: ['security', 'updates'] },
    push: { enabled: true, frequency: 'instant', categories: ['messages', 'reminders'] },
    sms: { enabled: false, reason: 'User preference' },
    newsletter: { enabled: false },
    weeklyReport: { enabled: true, lastSent: '2025-01-29T10:00:00Z' }
  },
  colors: {
    dark: 'shane',
    light: 'salmon',
    accent: 'goldenrod',
    background: '#121212',
    text: '#FFFFFF'
  }
};

const apiResponse = ocx(
  user,
  updated,
  { preferences, metadata },
  key => ({ fullName: [key?.profile?.name?.first, key?.profile?.name?.last].join(' ').trim(), timestamp: new Date().toISOString() }),
  key => key?.role === 'admin' && { permissions: ['read', 'write', 'delete'] }
);

console.log(JSON.stringify(apiResponse, (_, value) => value, 2));
```

- Result:
  ```json
  {
    "id": "1ab2C3",
    "username": "johndoe92",
    "email": "johndoe@example.com",
    "role": "admin",
    "colors": {
      "dark": "shane",
      "light": "salmon",
      "accent": "goldenrod",
      "background": "#121212",
      "text": "#FFFFFF"
    },
    "profile": {
      "age": 32,
      "name": {
        "first": "Johnathan",
        "last": "Doe"
      },
      "gender": "male",
      "phone": "+1-555-987-6543",
      "avatar": "https://example.com/avatars/johndoe99.png",
      "bio": "Software engineer and technology enthusiast who loves coding and open-source projects.",
      "education": [
        {
          "degree": "BSc Computer Science",
          "institution": "MIT",
          "yearGraduated": 2014
        },
        {
          "degree": "MSc Artificial Intelligence",
          "institution": "Stanford University",
          "yearGraduated": 2016
        }
      ],
      "workExperience": [
        {
          "company": "Google",
          "role": "Software Engineer",
          "startDate": "2016-07-01",
          "endDate": "2019-06-30"
        },
        {
          "company": "OpenAI",
          "role": "Lead Developer",
          "startDate": "2019-07-01",
          "endDate": "Present"
        }
      ],
      "skills": ["JavaScript", "TypeScript", "React", "Next.js", "Node.js", "AI", "Machine Learning"]
    },
    "address": {
      "street": "1234 Elm Street",
      "city": "Los Angeles",
      "state": "California",
      "country": "USA",
      "zipCode": "90001",
      "geo": {
        "lat": 34.0522,
        "lng": -118.2437
      }
    },
    "socialLink": {
      "twitter": "@johndoe",
      "linkedIn": "https://linkedin.com/in/johndoe",
      "github": "https://github.com/johndoe"
    },
    "status": "verified",
    "createdAt": "2022-12-15T08:45:00Z",
    "lastLogin": "2025-01-30T14:32:00Z",
    "lastIp": "192.168.1.100",
    "twoFactorAuth": {
      "enabled": true,
      "methods": ["authenticator_app", "sms", "whatsapp", "email"],
      "lastUpdated": "2024-09-20T13:15:00Z"
    },
    "activityHistory": [
      {
        "action": "login",
        "timestamp": "2025-01-30T14:32:00Z",
        "device": "iPhone 15 Plus",
        "ip": "192.168.1.10"
      },
      {
        "action": "update_profile",
        "timestamp": "2025-01-28T10:12:00Z",
        "changes": ["email", "phone"]
      },
      {
        "action": "reset_password",
        "timestamp": "2025-01-20T18:45:00Z",
        "method": "email_link"
      }
    ],
    "securityAlerts": [
      {
        "event": "suspicious_login",
        "timestamp": "2025-01-15T22:45:00Z",
        "location": "Russia",
        "status": "blocked"
      },
      {
        "event": "password_reset_request",
        "timestamp": "2025-01-20T10:00:00Z",
        "method": "email",
        "status": "approved"
      }
    ],
    "notifications": {
      "email": {
        "enabled": true,
        "frequency": "daily",
        "categories": ["security", "updates"]
      },
      "push": {
        "enabled": true,
        "frequency": "instant",
        "categories": ["messages", "reminders"]
      },
      "sms": {
        "reason": "User preference"
      },
      "weeklyReport": {
        "enabled": true,
        "lastSent": "2025-01-29T10:00:00Z"
      },
      "appUpdates": true,
      "securityAlerts": true
    },
    "sessions": {
      "web": {
        "active": true,
        "lastLogin": "2025-01-30T14:32:00Z",
        "ip": "192.168.1.100"
      },
      "windowsApp": {
        "lastLogin": "2024-12-15T08:45:00Z"
      },
      "mobileApp": {
        "active": true,
        "lastLogin": "2025-01-28T11:12:00Z",
        "device": "iPhone 15 Plus"
      }
    },
    "organizations": [
      {
        "id": "org-001",
        "name": "Tech Innovators Inc.",
        "role": "Lead Developer",
        "joinedAt": "2023-03-01T09:00:00Z"
      }
    ],
    "affiliations": [
      {
        "id": "aff-001",
        "name": "Open Source Community",
        "role": "Contributor",
        "since": "2021-06-10T12:00:00Z"
      }
    ],
    "enterprises": [
      {
        "id": "ent-001",
        "name": "Global Tech Solutions",
        "role": "Consultant",
        "since": "2022-01-15T08:00:00Z"
      }
    ],
    "replies": [
      {
        "id": "reply-001",
        "content": "I totally agree with this!",
        "timestamp": "2025-01-29T14:20:00Z"
      }
    ],
    "historyLog": [
      {
        "action": "profile_update",
        "timestamp": "2025-01-28T10:12:00Z",
        "details": ["email", "phone"]
      }
    ],
    "securityLog": [
      {
        "event": "failed_login_attempt",
        "timestamp": "2025-01-29T18:00:00Z",
        "ip": "192.168.1.50"
      }
    ],
    "preferences": {
      "theme": "dark",
      "lang": "en-US",
      "timezone": "America/Los_Angeles",
      "dateFormat": "MM/DD/YYYY",
      "timeFormat": "12h",
      "accessibility": {
        "textSize": "medium",
        "contrastMode": "high",
        "textToSpeech": true,
        "keyboardNavigation": true
      },
      "integrations": {
        "googleDrive": {
          "enabled": true,
          "lastSync": "2025-01-15T09:00:00Z"
        },
        "slack": {
          "enabled": true,
          "lastSync": "2025-01-10T12:30:00Z"
        }
      },
      "shortcuts": [
        {
          "key": "ctrl + k",
          "action": "Open search bar"
        },
        {
          "key": "ctrl + n",
          "action": "Create new document"
        },
        {
          "key": "ctrl + s",
          "action": "Save current work"
        }
      ]
    },
    "metadata": {
      "createdAt": "2023-01-01T10:00:00Z",
      "latestUpdated": "2025-01-01T12:45:00Z",
      "isPremium": true,
      "accountType": "business",
      "subscription": {
        "plan": "Pro",
        "startedAt": "2023-02-15T09:00:00Z",
        "expiresAt": "2026-02-15T09:00:00Z",
        "autoRenew": true,
        "paymentMethod": "credit_card",
        "lastPaymentDate": "2025-02-01T08:30:00Z",
        "invoices": [
          {
            "id": "INV-001",
            "date": "2024-01-15",
            "amount": 299.99,
            "status": "Paid"
          },
          {
            "id": "INV-002",
            "date": "2025-01-15",
            "amount": 299.99,
            "status": "Pending"
          }
        ],
        "usageStats": {
          "storageUsed": "150GB",
          "apiCalls": 12500,
          "lastBillingCycle": "2025-01-01T00:00:00Z"
        }
      },
      "security": {
        "lastPasswordChange": "2024-10-10T10:10:00Z",
        "failedLoginAttempts": 2,
        "passwordStrength": "strong",
        "recovery": {
          "email": "recovery@example.com",
          "phone": "+1-202-555-0199",
          "whatsapp": "+1-202-555-0199",
          "securityQuestions": [
            {
              "question": "What’s your mother’s maiden name?",
              "answerHash": "a7b8c9d10e"
            },
            {
              "question": "What was your first pet’s name?",
              "answerHash": "f2g3h4i5j6"
            }
          ]
        }
      },
      "devices": [
        {
          "merk": "iPhone 15 Plus",
          "brand": "apple",
          "model": "A2896",
          "os": "iOS 17.2",
          "method": "qrcode",
          "registeredAt": "2024-12-15T08:30:00Z",
          "ipAddress": "192.168.1.12",
          "location": {
            "country": "USA",
            "city": "Los Angeles",
            "geo": {
              "lat": 34.0522,
              "lng": -118.2437
            }
          },
          "lastActive": "2025-01-29T22:15:00Z",
          "status": "trusted"
        },
        {
          "merk": "ASUS ROG Phone 8",
          "brand": "android",
          "model": "ZS675KS",
          "os": "Android 14",
          "method": "passkey",
          "registeredAt": "2023-11-20T16:20:00Z",
          "ipAddress": "172.16.254.3",
          "location": {
            "country": "USA",
            "city": "San Francisco",
            "geo": {
              "lat": 37.7749,
              "lng": -122.4194
            }
          },
          "lastActive": "2025-01-25T18:05:00Z",
          "status": "pending_review"
        },
        {
          "merk": "MacBook Pro 16\"",
          "brand": "apple",
          "model": "M3 Max",
          "os": "macOS Sonoma",
          "method": "password",
          "registeredAt": "2023-09-10T14:10:00Z",
          "ipAddress": "192.168.1.20",
          "location": {
            "country": "USA",
            "city": "New York",
            "geo": {
              "lat": 40.7128,
              "lng": -74.006
            }
          },
          "lastActive": "2025-01-30T09:15:00Z",
          "status": "trusted"
        }
      ],
      "accessedApps": [
        {
          "name": "VS Code",
          "lastUsed": "2025-01-29T22:10:00Z"
        },
        {
          "name": "GitHub",
          "lastUsed": "2025-01-30T09:00:00Z"
        },
        {
          "name": "Slack",
          "lastUsed": "2025-01-28T15:45:00Z"
        }
      ]
    },
    "fullName": "Johnathan Doe",
    "timestamp": "2025-02-01T04:39:45.823Z",
    "permissions": ["read", "write", "delete"]
  }
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
// {
//   a: 1,
//   b: { b0: 'b0', b1: 'b1', b2: 'b2', b3: 'b3', b4: 'b4', b6: 'b6' },
//   e: 4,
//   f: { f1: 'FOO', f2: 'F2', f3: 'f3', f5: 'F5' },
//   h: { h1: 'h1', h2: 'h2' },
//   keys: [ 'a', 'b', 'e', 'f', 'g', 'h' ]
// }
```

### Complex API Serialization Example

```ts
const user = { id: 1, name: 'Alice', email: 'alice@example.com' };
const metadata = () => ({ timestamp: Date.now() });
const flags = { active: true, verified: false };

const serialized = ocx(user, metadata, flags);
console.log(serialized);
// {
//   id: 1,
//   name: 'Alice',
//   email: 'alice@example.com',
//   timestamp: 1738340551295,
//   active: true
// }
```

```ts
const data = [
  { id: 1, name: 'Alice', active: true, details: { role: 'user', age: 25 } },
  { id: 2, name: 'Bob', active: false, details: { role: 'moderator', age: 30 } },
  { id: 3, name: 'Charlie', active: true, details: { role: 'admin', age: 35 } }
];

const serialized = data.map(item =>
  ocx(
    item,
    { isAdult: item.details.age >= 18 },
    key => key?.active && { status: 'online' },
    !item.active && { status: 'offline', inactiveSince: '2023-12-01' }
  )
);

console.log(serialized);
```

- Result:
  ```json
  [
    {
      "id": 1,
      "name": "Alice",
      "active": true,
      "details": { "role": "user", "age": 25 },
      "isAdult": true,
      "status": "online"
    },
    {
      "id": 2,
      "name": "Bob",
      "details": { "role": "moderator", "age": 30 },
      "isAdult": true,
      "status": "offline",
      "inactiveSince": "2023-12-01"
    },
    {
      "id": 3,
      "name": "Charlie",
      "active": true,
      "details": { "role": "admin", "age": 35 },
      "isAdult": true,
      "status": "online"
    }
  ]
  ```

## Handling `Symbol` Keys in `ocx`

### Why Use `Symbol`?

- **Uniqueness:** Each Symbol is unique, preventing key conflicts.
- **Hidden Properties:** Symbol properties are not enumerable, making them useful for metadata.
- **Framework & API Integration:** Many libraries and built-in JavaScript functions use Symbol for custom behavior. <br /> Useful for internal or protected properties.

### Example Usage with `Symbol`

#### 1. `Symbol` as Object Keys

```ts
const metaKey = Symbol('metadata');
const user = {
  name: 'Alice',
  age: 25,
  [metaKey]: { role: 'admin', hidden: { others: 'hiddenValue' } }
};

const cleaned = ocx(user);
console.log(cleaned);
// {
//   name: 'Alice',
//   age: 25,
//   [Symbol(metadata)]: { role: 'admin', hidden: { others: 'hiddenValue' } }
// }
```

#### 2. Merging Objects with `Symbol`

```ts
const symA = Symbol('a');
const symB = Symbol('b');
const obj1 = { [symA]: 'Hello', x: 10 };
const obj2 = { [symB]: 'World', y: 20 };

const merged = ocx(obj1, obj2);
console.log(merged);
// { x: 10, y: 20, [Symbol(a)]: 'Hello', [Symbol(b)]: 'World' }
```

#### 3. Deep Merging with `Symbol`

```ts
const symA = Symbol('a');
const symB = Symbol('b');
const obj1 = { [symA]: 'Hello', x: 10 };
const obj2 = { [symB]: 'World', y: 20 };
const deepMerged = ocx(obj1, { y: 10, deep: { obj2 } });
console.log(deepMerged);
// {
//   x: 10,
//   y: 10,
//   deep: { obj2: { y: 20, [Symbol(b)]: 'World' } },
//   [Symbol(a)]: 'Hello'
// }
```

#### 4. `Symbol` in Nested Objects

```ts
const privateKey = Symbol('private');

const obj = {
  name: 'John',
  details: {
    age: 30,
    [privateKey]: 'Sensitive Data'
  }
};

const updated = ocx(obj, { details: { age: 31 } });
console.log(updated);
// {
//   name: 'John',
//   details: { age: 31, [Symbol(private)]: 'Sensitive Data' }
// }
```

#### 5. `Symbol` in Node.js (`util.inspect.custom`)

```ts
import util from 'util';
const obj = { name: 'Debug Object', [util.inspect.custom]: () => 'Custom Output' };
console.log(util.inspect(ocx(obj)));
// 'Custom Output'
```

## Advantages

✅ Simplifies dynamic object creation for configurations or API responses.
✅ Supports deep merging of objects.
✅ Handles arrays, functions, and dynamic values seamlessly.
✅ Filters out unnecessary or falsy values by default behavior.
✅ Provides `ocx.raw()` chaining If you need to **keep falsy values ​​while merger** (very useful for debugging).
✅ **Supports `Symbol` as keys**, ensuring metadata persistence.

<br />

---

---

# **cleanFalsy**

The `cleanFalsy` function removes all falsy values (`false`, `undefined`, `null`, `NaN`, `0`, `""`) from an object while preserving specified exceptions (e.g., 0 or false if required). It operates recursively on nested objects and arrays to ensure a fully sanitized output.

## Syntax

```ts
function cleanFalsy<T extends ocxKey>(obj: T, exclude?: unknown[]): T;
```

- `obj`: The object to clean.
- `exclude`: An optional array of values to preserve even if they are falsy. Default is [].

### How `cleanFalsy()` Works

1. **Removes Falsy Values:** <br/>
   Eliminates null, undefined, NaN, false, "" (empty strings), unless specified otherwise in exclude.

2. **Supports Deep Cleaning:** <br />
   Recursively removes falsy values from nested objects and arrays.

3. **Exclusion List:** <br />
   Allows certain values (e.g., 0 or false) to be retained by passing an exclude array.

## Example Usage

### Removing Falsy Values from an Object

```ts
const cleanedObject = {
  name: 'Bob',
  age: null,
  active: false,
  score: 0,
  address: ''
};

console.log(cleanFalsy(cleanedObject));
// { name: "Bob" }

console.log(cleanFalsy(cleanedObject, [0]));
// { name: "Bob", score: 0 }
```

### Removing Falsy Values from Arrays

```ts
const arr = { items: [0, false, 'hello', null, undefined, 'world'] };
console.log(cleanFalsy(arr));
// { items: [ 'hello', 'world' ] }
```

### Preserving Certain Falsy Values

```ts
const cleanedWithPreserved = cleanFalsy(
  { enabled: false, retries: 0, debug: null },
  [false, 0] // Preserve false and 0
);

console.log(cleanedWithPreserved);
// { enabled: false, retries: 0 }
```

### Cleaning Nested Objects

```ts
const cleanedNested = cleanFalsy({
  user: {
    name: 'Alice',
    details: {
      age: null,
      city: '',
      subscribed: false
    }
  }
});

console.log(cleanedNested);
// { user: { name: "Alice" } }
```

### Cleaning Arrays

```ts
const cleanedArray = cleanFalsy({
  items: [0, false, '', 42, null, 'hello'],
  extra: []
});

console.log(cleanedArray);
// { items: [42, "hello"] }
```

### Excluding Specific Values

```ts
const obj = { name: '', age: 0, active: false, device: 'android', address: {}, role: null };
console.log(cleanFalsy(obj, [false]));
// { active: false, device: 'android' }
```

---

## Advantages

✅ **Reduces unnecessary data** by removing `null`, `undefined`, and other falsy values.
✅ **Deeply cleans objects and arrays**, ensuring a well-structured and meaningful dataset.
✅ **Customizable exclusions**, allowing control over which falsy values should remain.
✅ **Enhances API responses** by removing redundant properties.
✅ **Improves performance** by reducing object size, leading to optimized data transmission.

With these enhancements, `ocx` and `cleanFalsy` offer powerful utilities for managing dynamic objects effectively!

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

## Example Usage

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

## Example Usage

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

## Example Usage

```ts
const pt = createConverter('pt');
pt(16);
// Output: "1pt"
```

## Advantages and Optimizations

✅ **Flexible:** Supports various input formats such as numbers, strings, and complex expressions.
✅ **High Compatibility:** Can be used for various unit conversion needs in CSS, including responsive units such as rem and em.
✅ **Advanced Expressions:** Supports operations with calc, clamp, and other CSS functions.
✅ **Scalability:** The createConverter function allows the creation of custom converters for other units in the future.

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
[Changelog](./CHANGELOG.md)

# **License**

[![© LICENSE](https://img.shields.io/github/license/ilkhoeri/cretex)](./LICENSE)

# **Others**

[![JSR Score](https://jsr.io/badges/@cretex/dynamic/score?label=score)](https://jsr.io/@cretex/dynamic)

[![jsdelivr](https://img.shields.io/jsdelivr/npm/hm/cretex?logo=jsdelivr)](https://www.jsdelivr.com/package/npm/cretex)

[![min](https://badgen.net/bundlephobia/min/cretex)](https://bundlephobia.com/package/cretex)
[![minzip](https://badgen.net/bundlephobia/minzip/cretex)](https://bundlephobia.com/package/cretex)
[![dependency-count](https://badgen.net/bundlephobia/dependency-count/cretex)](https://bundlephobia.com/package/cretex)
[![tree-shaking](https://badgen.net/bundlephobia/tree-shaking/cretex)](https://bundlephobia.com/package/cretex)

[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/ilkhoeri/cretex/test.yml?branch=main&label=Unit%20Tests&style=flat-square)](https://github.com/ilkhoeri/cretex)
[![Test Coverage](https://img.shields.io/codeclimate/coverage/ilkhoeri/cretex?style=flat-square)](https://codeclimate.com/github/ilkhoeri/cretex/test_coverage)
