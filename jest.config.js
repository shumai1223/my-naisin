module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/tests/e2e/'],
  globals: {
    'ts-jest': {
      // jest 専用 tsconfig：本番は jsx:preserve（Next が変換）だが、
      // ts-jest は自前で JSX を React へ変換する必要があるため react-jsx に上書きする。
      tsconfig: 'tsconfig.jest.json',
    },
  },
};