import type { Config } from 'tailwindcss';

/**
 * デザインシステム「やさしい学習帳」（docs/design/DESIGN-SYSTEM.md）。
 * - 色: 深緑(brand)1色 + 緑みの灰(slate) + 意味の色(amber=注意・red=危険)。
 * - 他の色相は、動的に組み立てたクラス（`bg-${color}-500` 等）が残っていても虹色にならないよう、ここで置き換える（安全網）。
 * - 影・大きな角丸・太字の指定は、書き方が残っていても平らな見た目になるよう上書きする。
 */

// 深緑（ブランド）。700 = #17543e が基準。
const brand = {
  50: '#f0f6f3',
  100: '#e0ece6',
  200: '#c3d9cf',
  300: '#9cc0b0',
  400: '#5f9d86',
  500: '#348164',
  600: '#1f6a4e',
  700: '#17543e',
  800: '#123f2f',
  900: '#0d2d22',
  950: '#071a14',
};

// 緑みの灰（文字・罫線・面）。200 が罫線、600 が補助文字、900 が本文。
const slate = {
  50: '#f4f7f5',
  100: '#e9efeb',
  200: '#cddad3',
  300: '#aebfb6',
  400: '#86988e',
  500: '#66786e',
  600: '#4f6158',
  700: '#3a4a42',
  800: '#26342d',
  900: '#17231d',
  950: '#0e1612',
};

// 注意（琥珀）・危険（赤）: 既定より彩度を落とす。
const amber = {
  50: '#fbf6e8',
  100: '#f6ebc6',
  200: '#edd78f',
  300: '#e2bd55',
  400: '#d4a02a',
  500: '#b9831a',
  600: '#966612',
  700: '#734e10',
  800: '#5a3d12',
  900: '#473012',
  950: '#2a1c08',
};
const red = {
  50: '#fcf1ef',
  100: '#f9dfda',
  200: '#f2bdb4',
  300: '#e8928a',
  400: '#d9645c',
  500: '#c4413a',
  600: '#a8322d',
  700: '#8a2825',
  800: '#6f2321',
  900: '#5a1f1d',
  950: '#330f0e',
};

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    // 角丸: 6px(入力・ボタン・タグ) / 8px(カード)。大きい指定は全て8pxに丸める。
    borderRadius: {
      none: '0',
      sm: '4px',
      DEFAULT: '6px',
      md: '6px',
      lg: '8px',
      xl: '8px',
      '2xl': '8px',
      '3xl': '8px',
      full: '9999px',
    },
    // 影: 使わない。オーバーレイ(モーダル・ドロップダウン・固定バー)だけ overlay。
    boxShadow: {
      sm: 'none',
      DEFAULT: 'none',
      md: 'none',
      lg: 'none',
      xl: 'none',
      '2xl': 'none',
      inner: 'none',
      glow: 'none',
      'glow-lg': 'none',
      overlay: '0 8px 24px rgb(23 35 29 / 0.14)',
      none: 'none',
    },
    dropShadow: {
      sm: '0 0 #0000',
      DEFAULT: '0 0 #0000',
      md: '0 0 #0000',
      lg: '0 0 #0000',
      xl: '0 0 #0000',
      '2xl': '0 0 #0000',
      none: '0 0 #0000',
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-biz-ud)', 'var(--font-noto-sans-jp)', 'system-ui', 'Hiragino Kaku Gothic ProN', 'Meiryo', 'sans-serif'],
      },
      colors: {
        brand,
        paper: '#f4f7f5',
        ink: '#17231d',
        // 緑みの灰に統一
        slate,
        gray: slate,
        zinc: slate,
        neutral: slate,
        stone: slate,
        // 意味の色
        amber,
        red,
        // 使わない色相の置き換え（安全網）
        orange: amber,
        yellow: amber,
        rose: red,
        blue: brand,
        indigo: brand,
        sky: brand,
        cyan: brand,
        teal: brand,
        emerald: brand,
        green: brand,
        lime: brand,
        purple: slate,
        violet: slate,
        fuchsia: slate,
        pink: slate,
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out both',
        'fade-in-up': 'fade-in 0.2s ease-out both',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
