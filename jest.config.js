module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/tests/e2e/'],
  // ZZ-7b（site-in-a-box工場実証）でmy-shingaku側の改善として発見・逆輸入：
  // .open-next（opennextjs-cloudflare build出力）にpackage.jsonが複製され、
  // jest-haste-mapの命名衝突警告が出るため除外する。
  modulePathIgnorePatterns: ['<rootDir>/.open-next/'],
  globals: {
    'ts-jest': {
      // jest 専用 tsconfig：本番は jsx:preserve（Next が変換）だが、
      // ts-jest は自前で JSX を React へ変換する必要があるため react-jsx に上書きする。
      tsconfig: 'tsconfig.jest.json',
    },
  },
};