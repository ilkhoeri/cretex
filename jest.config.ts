import { JestConfigWithTsJest } from 'ts-jest';

const JestConfig: JestConfigWithTsJest = {
  testEnvironment: 'node',
  transform: {
    '^.+.tsx?$': ['ts-jest', {}]
  },
  preset: 'ts-jest',
  roots: ['./src'],
  moduleFileExtensions: ['ts', 'js']
};

export default JestConfig;
