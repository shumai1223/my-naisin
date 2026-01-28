import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      opacity: {
        6: '0.06',
        7: '0.07',
        8: '0.08',
        12: '0.12',
        14: '0.14',
        18: '0.18'
      },
      boxShadow: {
        neon: '0 0 0 1px rgba(255,255,255,0.08), 0 30px 100px rgba(0,0,0,0.55)'
      },
      keyframes: {
        mesh: {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(3%,-2%,0) scale(1.08)' }
        },
        float: {
          '0%, 100%': { transform: 'translate3d(0,0,0)' },
          '50%': { transform: 'translate3d(0,-8px,0)' }
        }
      },
      animation: {
        mesh: 'mesh 18s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite'
      }
    }
  },
  plugins: []
};

export default config;
