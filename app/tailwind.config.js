/** @type {import('tailwindcss').Config} */
// Matrix-inspired palette: black ground, phosphor green, red for attack, amber for warnings.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#010603', 2: '#03110a', 3: '#072414', deep: '#000000', line: '#0d3b1e' },
        teal: { DEFAULT: '#00ff41', 2: '#8dffab' },
        ink: { DEFAULT: '#d7ffe0', muted: '#86b894', dim: '#4f7d5c' },
        attack: '#ff3355',
        defense: '#22ff88',
        warn: '#ffb000',
        brand: '#0f6d63',
      },
      fontFamily: {
        display: ['Orbitron', '"Share Tech Mono"', 'monospace'],
        body: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"Share Tech Mono"', '"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        rise: { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'none' } },
        pop: { from: { opacity: '0', transform: 'scale(.97)' }, to: { opacity: '1', transform: 'none' } },
        stamp: {
          '0%': { opacity: '0', transform: 'scale(1.35)' },
          '12%': { opacity: '1', transform: 'scale(.97)' },
          '20%': { transform: 'scale(1)' },
          '85%': { opacity: '1' },
          '100%': { opacity: '0', transform: 'scale(.98)' },
        },
        vignette: { '0%': { opacity: '0' }, '15%': { opacity: '1' }, '80%': { opacity: '.7' }, '100%': { opacity: '0' } },
        flicker: { '0%,100%': { opacity: '1' }, '92%': { opacity: '1' }, '93%': { opacity: '.6' }, '94%': { opacity: '1' }, '96%': { opacity: '.8' } },
        blink: { '0%,49%': { opacity: '1' }, '50%,100%': { opacity: '0' } },
      },
      animation: {
        rise: 'rise .5s cubic-bezier(.2,.7,.2,1) both',
        pop: 'pop .35s ease both',
        stamp: 'stamp 2.2s cubic-bezier(.2,.7,.2,1) both',
        vignette: 'vignette 2.2s ease both',
        flicker: 'flicker 6s linear infinite',
        blink: 'blink 1s step-end infinite',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(0,255,65,.35), 0 0 30px -6px rgba(0,255,65,.45)',
        'glow-red': '0 0 0 1px rgba(255,51,85,.5), 0 0 34px -6px rgba(255,51,85,.6)',
      },
    },
  },
  plugins: [],
}
