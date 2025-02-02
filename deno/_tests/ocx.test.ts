// @ts-ignore TS6133
import { expect } from 'https://deno.land/x/expect@v0.2.6/mod.ts';
const test = Deno.test;

import { ocx } from '../lib/ocx.ts'; // Named export
import * as x from '../lib/index.ts'; // Test for namespace imports

test('Default', () => {
  expect(
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
    )
  ).toEqual({ a: 1, b: 2, d: 4, c: 3, 'key?.a': true });
});

test('Default behavior 1', () => {
  const result = ocx({ name: 'John', age: null }, { age: 30, city: 'New York' }, () => ({ country: 'USA' }));
  expect(result).toEqual({ name: 'John', age: 30, city: 'New York', country: 'USA' });
});

test('Default behavior 2', () => {
  const dynamic = (prev: x.ocxKey) => prev?.a && { e: prev.a + 5 };
  const result = ocx([{ a: 1 }], [{ b: 2 }, { c: 3 }], { d: 4 }, dynamic);
  expect(result).toEqual({ a: 1, b: 2, c: 3, d: 4, e: 6 });
});

test('Example chaining raw', () => {
  const result = ocx.raw({ enabled: false, features: { darkMode: true } }, { features: { darkMode: null, betaMode: true } });
  expect(result).toEqual({ enabled: false, features: { darkMode: null, betaMode: true } });
});

test('Dynamic API Response Combination', () => {
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
  expect(response).toEqual({ id: 123, name: 'Alice', settings: { theme: 'light' } });
});

test('Example Complex Merging of Nested and Dynamic Data', () => {
  const target = { a: 1, b: { b0: 'b0', b1: 'b1' } };
  const source = { b: { b0: 'b0', b2: 'b2', b3: 'b3' }, e: 4 };
  const deepSource = { b: { b4: 'b4', b6: 'b6' }, f: 4 };
  const dynamicSource = [
    { f: { f1: 'f1', f2: 'f2' } },
    { g: NaN && 'g0' }, // like this if you want to use the falsy value of key?.g
    !false && { h: { h1: 'h1', h2: 'h2' } }, // like this if you want to get valid value
    true && { f: { f3: 'f3', f1: 'F1' } }
  ];
  const getKeys = (key?: x.ocxKey) => key && { keys: Object.keys(key) };
  expect(
    ocx(
      'ignored',
      target,
      source,
      deepSource,
      () => dynamicSource,
      key => key?.f && { f: { f5: 'F5', f2: 'F2', f1: 'FOO' } },
      getKeys
    )
  ).toEqual({
    a: 1,
    b: { b0: 'b0', b1: 'b1', b2: 'b2', b3: 'b3', b4: 'b4', b6: 'b6' },
    e: 4,
    f: { f1: 'FOO', f2: 'F2', f3: 'f3', f5: 'F5' },
    h: { h1: 'h1', h2: 'h2' },
    keys: ['a', 'b', 'e', 'f', 'g', 'h']
  });
});

test('Example Complex API Serialization Example', () => {
  const user = { id: 1, name: 'Alice', email: 'alice@example.com' };
  const metadata = () => ({ timestamp: 1738340551295 });
  const flags = { active: true, verified: false };

  const serialized = ocx(user, metadata, flags);
  expect(serialized).toEqual({
    id: 1,
    name: 'Alice',
    email: 'alice@example.com',
    timestamp: 1738340551295,
    active: true
  });
});

test('Example API Serialization Example', () => {
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
  expect(serialized).toEqual([
    {
      id: 1,
      name: 'Alice',
      active: true,
      details: { role: 'user', age: 25 },
      isAdult: true,
      status: 'online'
    },
    {
      id: 2,
      name: 'Bob',
      details: { role: 'moderator', age: 30 },
      isAdult: true,
      status: 'offline',
      inactiveSince: '2023-12-01'
    },
    {
      id: 3,
      name: 'Charlie',
      active: true,
      details: { role: 'admin', age: 35 },
      isAdult: true,
      status: 'online'
    }
  ]);
});

test('Complex API Response Combination with additional data', () => {
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
    key => ({ fullName: [key?.profile?.name?.first, key?.profile?.name?.last].join(' ').trim(), timestamp: '2025-02-01T15:53:06.429Z' }),
    key => key?.role === 'admin' && { permissions: ['read', 'write', 'delete'] }
  );
  expect(apiResponse).toEqual({
    id: '1ab2C3',
    username: 'johndoe92',
    email: 'johndoe@example.com',
    role: 'admin',
    colors: {
      dark: 'shane',
      light: 'salmon',
      accent: 'goldenrod',
      background: '#121212',
      text: '#FFFFFF'
    },
    profile: {
      age: 32,
      name: {
        first: 'Johnathan',
        last: 'Doe'
      },
      gender: 'male',
      phone: '+1-555-987-6543',
      avatar: 'https://example.com/avatars/johndoe99.png',
      bio: 'Software engineer and technology enthusiast who loves coding and open-source projects.',
      education: [
        {
          degree: 'BSc Computer Science',
          institution: 'MIT',
          yearGraduated: 2014
        },
        {
          degree: 'MSc Artificial Intelligence',
          institution: 'Stanford University',
          yearGraduated: 2016
        }
      ],
      workExperience: [
        {
          company: 'Google',
          role: 'Software Engineer',
          startDate: '2016-07-01',
          endDate: '2019-06-30'
        },
        {
          company: 'OpenAI',
          role: 'Lead Developer',
          startDate: '2019-07-01',
          endDate: 'Present'
        }
      ],
      skills: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'AI', 'Machine Learning']
    },
    address: {
      street: '1234 Elm Street',
      city: 'Los Angeles',
      state: 'California',
      country: 'USA',
      zipCode: '90001',
      geo: {
        lat: 34.0522,
        lng: -118.2437
      }
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
      {
        action: 'login',
        timestamp: '2025-01-30T14:32:00Z',
        device: 'iPhone 15 Plus',
        ip: '192.168.1.10'
      },
      {
        action: 'update_profile',
        timestamp: '2025-01-28T10:12:00Z',
        changes: ['email', 'phone']
      },
      {
        action: 'reset_password',
        timestamp: '2025-01-20T18:45:00Z',
        method: 'email_link'
      }
    ],
    securityAlerts: [
      {
        event: 'suspicious_login',
        timestamp: '2025-01-15T22:45:00Z',
        location: 'Russia',
        status: 'blocked'
      },
      {
        event: 'password_reset_request',
        timestamp: '2025-01-20T10:00:00Z',
        method: 'email',
        status: 'approved'
      }
    ],
    notifications: {
      email: {
        enabled: true,
        frequency: 'daily',
        categories: ['security', 'updates']
      },
      push: {
        enabled: true,
        frequency: 'instant',
        categories: ['messages', 'reminders']
      },
      sms: {
        reason: 'User preference'
      },
      weeklyReport: {
        enabled: true,
        lastSent: '2025-01-29T10:00:00Z'
      },
      appUpdates: true,
      securityAlerts: true
    },
    sessions: {
      web: {
        active: true,
        lastLogin: '2025-01-30T14:32:00Z',
        ip: '192.168.1.100'
      },
      windowsApp: {
        lastLogin: '2024-12-15T08:45:00Z'
      },
      mobileApp: {
        active: true,
        lastLogin: '2025-01-28T11:12:00Z',
        device: 'iPhone 15 Plus'
      }
    },
    organizations: [
      {
        id: 'org-001',
        name: 'Tech Innovators Inc.',
        role: 'Lead Developer',
        joinedAt: '2023-03-01T09:00:00Z'
      }
    ],
    affiliations: [
      {
        id: 'aff-001',
        name: 'Open Source Community',
        role: 'Contributor',
        since: '2021-06-10T12:00:00Z'
      }
    ],
    enterprises: [
      {
        id: 'ent-001',
        name: 'Global Tech Solutions',
        role: 'Consultant',
        since: '2022-01-15T08:00:00Z'
      }
    ],
    replies: [
      {
        id: 'reply-001',
        content: 'I totally agree with this!',
        timestamp: '2025-01-29T14:20:00Z'
      }
    ],
    historyLog: [
      {
        action: 'profile_update',
        timestamp: '2025-01-28T10:12:00Z',
        details: ['email', 'phone']
      }
    ],
    securityLog: [
      {
        event: 'failed_login_attempt',
        timestamp: '2025-01-29T18:00:00Z',
        ip: '192.168.1.50'
      }
    ],
    preferences: {
      theme: 'dark',
      lang: 'en-US',
      timezone: 'America/Los_Angeles',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h',
      accessibility: {
        textSize: 'medium',
        contrastMode: 'high',
        textToSpeech: true,
        keyboardNavigation: true
      },
      integrations: {
        googleDrive: {
          enabled: true,
          lastSync: '2025-01-15T09:00:00Z'
        },
        slack: {
          enabled: true,
          lastSync: '2025-01-10T12:30:00Z'
        }
      },
      shortcuts: [
        {
          key: 'ctrl + k',
          action: 'Open search bar'
        },
        {
          key: 'ctrl + n',
          action: 'Create new document'
        },
        {
          key: 'ctrl + s',
          action: 'Save current work'
        }
      ]
    },
    metadata: {
      createdAt: '2023-01-01T10:00:00Z',
      latestUpdated: '2025-01-01T12:45:00Z',
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
          {
            id: 'INV-001',
            date: '2024-01-15',
            amount: 299.99,
            status: 'Paid'
          },
          {
            id: 'INV-002',
            date: '2025-01-15',
            amount: 299.99,
            status: 'Pending'
          }
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
            {
              question: 'What’s your mother’s maiden name?',
              answerHash: 'a7b8c9d10e'
            },
            {
              question: 'What was your first pet’s name?',
              answerHash: 'f2g3h4i5j6'
            }
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
          location: {
            country: 'USA',
            city: 'Los Angeles',
            geo: {
              lat: 34.0522,
              lng: -118.2437
            }
          },
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
          location: {
            country: 'USA',
            city: 'San Francisco',
            geo: {
              lat: 37.7749,
              lng: -122.4194
            }
          },
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
          location: {
            country: 'USA',
            city: 'New York',
            geo: {
              lat: 40.7128,
              lng: -74.006
            }
          },
          lastActive: '2025-01-30T09:15:00Z',
          status: 'trusted'
        }
      ],
      accessedApps: [
        {
          name: 'VS Code',
          lastUsed: '2025-01-29T22:10:00Z'
        },
        {
          name: 'GitHub',
          lastUsed: '2025-01-30T09:00:00Z'
        },
        {
          name: 'Slack',
          lastUsed: '2025-01-28T15:45:00Z'
        }
      ]
    },
    fullName: 'Johnathan Doe',
    timestamp: '2025-02-01T15:53:06.429Z',
    permissions: ['read', 'write', 'delete']
  });
});

test('should return the accumulator unchanged for falsy values', () => {
  expect(ocx({ key: 'value' }, null, undefined, false, 0, '')).toEqual({ key: 'value' });
});

test('should return an empty object when no valid input is provided', () => {
  expect(ocx(null, undefined, false, 0, '')).toEqual({});
});

test('should skip falsy values like null, undefined, or false', () => {
  expect(ocx(0)).toEqual({});
});

test('should return an empty object if no valid inputs are provided', () => {
  expect(ocx(null, undefined, false)).toEqual({});
});

test('should return the accumulator when input is null', () => {
  expect(ocx(null)).toEqual({});
});

test('should return the accumulator when input is undefined', () => {
  expect(ocx(undefined)).toEqual({});
});

test('should return the accumulator when input is falsy', () => {
  expect(ocx(false)).toEqual({});
});

test('should return the accumulator when input is falsy', () => {
  expect(ocx('ignore')).toEqual({});
});

test('should return the accumulator when input is falsy', () => {
  expect(ocx({})).toEqual({});
});

test('should merge multiple objects', () => {
  const obj1 = { key1: 'value1' };
  const obj2 = { key2: 'value2' };
  const result = ocx(obj1, obj2);
  expect(result).toEqual({ key1: 'value1', key2: 'value2' });
});

test('should handle nested objects', () => {
  const obj1 = { key1: { nestedKey: 'nestedValue' } };
  const obj2 = { key2: 'value2' };
  const result = ocx(obj1, obj2);
  expect(result).toEqual({ key1: { nestedKey: 'nestedValue' }, key2: 'value2' });
});

test('should handle arrays of objects', () => {
  const input = [{ key1: 'value1' }, { key2: 'value2' }];
  const result = ocx(input);
  expect(result).toEqual({ key1: 'value1', key2: 'value2' });
});

test('should handle nested arrays of objects', () => {
  const input = [[{ key1: 'value1' }], { key2: 'value2' }];
  const result = ocx(input);
  expect(result).toEqual({ key1: 'value1', key2: 'value2' });
});

test('should handle functions returning objects', () => {
  const input = () => ({ key1: 'value1' });
  const result = ocx(input);
  expect(result).toEqual({ key1: 'value1' });
});

test('should handle nested functions', () => {
  const input = () => () => ({ key1: 'value1' });
  const result = ocx(input);
  expect(result).toEqual({ key1: 'value1' });
});

test('should handle mixed inputs (objects, arrays, functions)', () => {
  const obj1 = { key1: 'value1' };
  const arr = [{ key2: 'value2' }, { key3: 'value3' }];
  const fn = () => ({ key4: 'value4' });
  const result = ocx(obj1, arr, fn);
  expect(result).toEqual({
    key1: 'value1',
    key2: 'value2',
    key3: 'value3',
    key4: 'value4'
  });
});

test('should handle arrays of objects', () => {
  const input = [{ key1: 'value1' }, { key2: 'value2' }];
  expect(ocx(input)).toEqual({ key1: 'value1', key2: 'value2' });
});

test('should handle nested arrays of objects', () => {
  const input = [[{ key1: 'value1' }], { key2: 'value2' }];
  expect(ocx(input)).toEqual({ key1: 'value1', key2: 'value2' });
});

test('should handle functions returning objects', () => {
  const input = () => ({ key1: 'value1' });
  expect(ocx(input)).toEqual({ key1: 'value1' });
});

test('should handle nested functions returning objects', () => {
  const input = () => () => ({ key1: 'value1' });
  expect(ocx(input)).toEqual({ key1: 'value1' });
});

test('should handle functions returning falsy values', () => {
  const input = () => null;
  expect(ocx(input)).toEqual({});
});

test('should handle mixed objects, arrays, and functions', () => {
  const obj = { key1: 'value1' };
  const arr = [{ key2: 'value2' }, { key3: 'value3' }];
  const fn = () => ({ key4: 'value4' });
  expect(ocx(obj, arr, fn)).toEqual({
    key1: 'value1',
    key2: 'value2',
    key3: 'value3',
    key4: 'value4'
  });
});

test('should handle deeply nested mixed inputs', () => {
  const obj = { key1: { nestedKey: 'value1' } };
  const arr = [[{ key2: 'value2' }], { key3: 'value3' }];
  const fn = () => ({ key4: { nestedKey: 'value4' } });
  expect(ocx(obj, arr, fn)).toEqual({
    key1: { nestedKey: 'value1' },
    key2: 'value2',
    key3: 'value3',
    key4: { nestedKey: 'value4' }
  });
});

test('should handle mixed objects, arrays, and functions', () => {
  const obj = { key1: false };
  const arr = [{ key2: undefined }, { key3: null }];
  const fn = () => ({ key4: 'value4' });
  expect(ocx.raw(obj, arr, fn)).toEqual({ key1: false, key2: undefined, key3: null, key4: 'value4' });
});

test('should handle deeply nested mixed inputs', () => {
  const obj = { key1: !true && { nestedKey: 'value1' } };
  const arr = [[{ key2: 'value2' }], false && { key3: 'value3' }];
  const fn = () => ({ key4: { nestedKey: 'value4' } });
  expect(ocx.raw(obj, arr, fn)).toEqual({ key1: false, key2: 'value2', key4: { nestedKey: 'value4' } });
});

test('should merge nested objects with the same key (direct objects)', () => {
  const obj1 = { key1: { nestedKey: 'value1' } };
  const obj2 = { key1: { nestedKey2: 'value2' } };

  const result = ocx(obj1, obj2);

  expect(result).toEqual({
    key1: {
      nestedKey: 'value1',
      nestedKey2: 'value2'
    }
  });
});

test('should merge nested objects with the same key (via functions)', () => {
  const obj1 = { key1: { nestedKey: 'value1' } };
  const objFn = () => ({ key1: { nestedKey2: 'value2' } });

  const result = ocx(obj1, objFn);

  expect(result).toEqual({
    key1: {
      nestedKey: 'value1',
      nestedKey2: 'value2'
    }
  });
});

test('should merge nested objects in multiple layers', () => {
  const obj1 = { key1: { nestedKey1: { subKey: 'value1' } } };
  const obj2 = { key1: { nestedKey1: { subKey2: 'value2' } } };

  const result = ocx(obj1, obj2);

  expect(result).toEqual({
    key1: {
      nestedKey1: {
        subKey: 'value1',
        subKey2: 'value2' // Deep merge recursive terjadi di sini
      }
    }
  });
});

test('should merge multiple layers with functions and objects', () => {
  const obj1 = { key1: { nestedKey1: { subKey: 'value1' } } };
  const objFn = () => ({ key1: { nestedKey1: { subKey2: 'value2' } } });

  const result = ocx(obj1, objFn);

  expect(result).toEqual({
    key1: {
      nestedKey1: {
        subKey: 'value1',
        subKey2: 'value2' // Deep merge recursive dengan fungsi
      }
    }
  });
});

test('should handle empty inputs', () => {
  expect(ocx()).toEqual({});
});

test('should handle circular references gracefully', () => {
  const obj: any = {};
  obj.self = obj;
  expect(() => ocx(obj)).not.toThrow();
});

test('should handle symbols as keys', () => {
  const sym = Symbol('key');
  const obj = { [sym]: 'value' };
  expect(ocx(obj)).toEqual({ [sym]: 'value' });
});

test('should handle symbols as [Symbol(metadata)]', () => {
  const metaKey = Symbol('metadata');
  const user = {
    name: 'Alice',
    age: 25,
    [metaKey]: { role: 'admin' }
  };

  // Menggunakan ocx untuk membersihkan objek tanpa menghapus Symbol
  const obj = ocx(user);
  expect(ocx(obj)).toEqual({ name: 'Alice', age: 25, [metaKey]: { role: 'admin' } });
});

test('should handle circular references gracefully', () => {
  const obj: any = {};
  obj.self = obj; // Circular reference

  const result = x.ocx.raw(obj);

  expect(result).toEqual({ self: { self: obj } });
});

test('should prevent infinite recursion with deep circular references', () => {
  const objA: x.ocxKey = { name: 'A' };
  const objB: x.ocxKey = { name: 'B', ref: objA };
  objA.ref = objB; // Circular reference

  const result = x.ocx(objA, objB);
  expect(result).toEqual({ name: 'B', ref: { name: 'A', ref: { name: 'B', ref: { name: 'A', ref: objB } } } });
});

test('should return the same object if circular reference is detected', () => {
  const obj: any = { key: 'value' };
  obj.loop = obj; // Circular reference

  const result = x.ocx.raw(obj);

  expect(result).toEqual({ key: 'value', loop: { key: 'value', loop: obj } });
  expect(result.loop).toEqual({ key: 'value', loop: obj }); // Ensure reference is maintained
});

test('should skip falsy values like null, undefined, or false', () => {
  expect(ocx.preserve()).toEqual({});
});

test('should return acc when input is null or undefined', () => {
  const acc = { key: 'value' };
  expect(ocx.preserve(acc, null)).toEqual(acc);
  expect(ocx.preserve(acc, undefined)).toEqual(acc);
});

test('should merge objects correctly', () => {
  const acc = { key1: 'value1' };
  const input = { key2: 'value2' };
  expect(ocx.preserve(acc, input)).toEqual({ key1: 'value1', key2: 'value2' });
});

test('should handle array inputs', () => {
  const acc = { key1: 'value1' };
  const input = [{ key2: 'value2' }, { key3: 'value3' }];
  expect(ocx.preserve(acc, input)).toEqual({ key1: 'value1', key2: 'value2', key3: 'value3' });
});

test('should call and merge function results', () => {
  const acc = { key1: 'value1' };
  const funcInput = () => ({ key2: 'value2' });
  expect(ocx.preserve(acc, funcInput)).toEqual({ key1: 'value1', key2: 'value2' });
});

test('should handle function returning a non-object value', () => {
  const acc = { key1: 'value1' };
  const funcInput = () => 'someValue';
  expect(ocx.preserve(acc, funcInput)).toEqual({ key1: 'value1', ...ocx.raw('someValue') });
});

test('should return acc when input does not change it', () => {
  const acc = { key1: 'value1' };
  expect(ocx.preserve(acc, {})).toEqual(acc);
});

test('should skip falsy values like null, undefined, or false', () => {
  const obj1 = { key1: { nestedKey1: { subKey: 'value1' } } };
  const objFn = () => ({ key1: { nestedKey1: { subKey2: 'value2' } } });

  const result = ocx.preserve(obj1, objFn);

  expect(result).toEqual({
    key1: {
      nestedKey1: {
        subKey: 'value1',
        subKey2: 'value2' // Deep merge recursive dengan fungsi
      }
    }
  });
});

test('should prevent infinite recursion', () => {
  const obj: any = { key: 'value' };
  obj.loop = obj; // Circular reference

  const result = ocx.preserve(obj);

  expect(result).toEqual({ key: 'value', loop: { key: 'value', loop: obj } });
  expect(result.loop).toEqual({ key: 'value', loop: obj });
});

test('should prevent infinite recursion with deep circular references', () => {
  const objA: x.ocxKey = { name: 'A' };
  const objB: x.ocxKey = { name: 'B', ref: objA };
  objA.ref = objB; // Circular reference

  const result = x.ocx.preserve(objA, objB);
  expect(result).toEqual({ name: 'A', ref: { name: 'A', ref: { name: 'B', ref: objA } } });
});

test('should correctly export ocx as a named export', () => {
  expect(ocx).toBeDefined();
  expect(typeof ocx).toBe('function');
});

test('should correctly export ocx as the default export (alias x)', () => {
  expect(x.ocx).toBeDefined();
  expect(typeof x.ocx).toBe('function');
  expect(x.ocx).toBe(ocx); // Ensure both exports point to the same function
});

test('should include ocx in the namespace export', () => {
  expect(x).toHaveProperty('ocx');
  expect(x.ocx).toBe(ocx);
});

test('should include the default export alias in the namespace export', () => {
  expect(x).toHaveProperty('default');
  expect(x.ocx).toBe(ocx);
});
