import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0A0E17',
        surface: '#12172A',
        line: '#232C48',
        signal: '#22D6C0',
        mist: '#8791AE',
        warn: '#FF6B5C',
      },
    },
  },
  plugins: [],
};
export default config;
