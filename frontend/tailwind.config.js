/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors'

module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
    "./node_modules/primevue/**/*.{vue,js,ts,jsx,tsx}",
    "./cms/**/*.{js,vue,ts}"
  ],
  theme: {
    extend: {
      container: {
        // you can configure the container to be centered
        center: true,

        // or have default horizontal padding
        padding: '1rem',

        // default breakpoints but with 40px removed
        screens: {
          sm: '600px',
          md: '728px',
          lg: '984px',
          xl: '1400px',
        },
      },
      colors: {
        primary: '#FFC700',
        background: '#F9FAFB',
        danger: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8',
        help: '#4406CB',
      }
    }
  },
  plugins: [
    require('@tailwindcss/container-queries'),
    require('tailwind-scrollbar'),
  ],
}

