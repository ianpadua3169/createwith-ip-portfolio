/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue'
  ],
  theme: {
    extend: {
      colors: {
        terminal: {
          green: '#00FF41',
          cyan: '#00D9FF',
          purple: '#9D4EDD',
          dark: '#0A0E27',
          panel: '#0F1929'
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace']
      }
    }
  },
  plugins: []
}
