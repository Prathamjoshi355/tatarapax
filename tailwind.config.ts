import type { Config } from 'tailwindcss';

export default {
  theme: {
    extend: {
      screens: {
        'mobileM': '375px',
        'mobileL': '425px',
      },
    },
  },
  plugins: [],
} satisfies Config;
