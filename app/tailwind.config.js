/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#0B1F3A', 2: '#0f2747', 3: '#163660', deep: '#06152a', line: '#24476f' },
        teal: { DEFAULT: '#14B8A6', 2: '#2dd4bf' },
        ink: { DEFAULT: '#EAF2FA', muted: '#93A9C4', dim: '#6a84a3' },
        attack: '#EF4444',
        defense: '#22C55E',
        warn: '#F59E0B',
        brand: '#0f6d63',
      },
      fontFamily: {
        display: ['Outfit', 'system-ui', 'sans-serif'],
        body: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        rise: { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'none' } },
        pop: { from: { opacity: '0', transform: 'scale(.97)' }, to: { opacity: '1', transform: 'none' } },
      },
      animation: { rise: 'rise .5s cubic-bezier(.2,.7,.2,1) both', pop: 'pop .35s ease both' },
    },
  },
  plugins: [],
}
