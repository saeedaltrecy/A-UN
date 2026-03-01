/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./css/**/*.{html,js}", "./js/**/*.{html,js}", "./img/**/*.{html,js}", "./index.html"],
  safelist: [
    'text-primary',
    'bg-primary',
    'border-primary',
    'hover:text-primary',
    'hover:bg-primary'
  ],
  theme: {
    extend: {
      maxWidth: {
        '8xl': '88rem', // 1408px
        '9xl': '96rem', // 1536px
        '10xl': '104rem', // 1664px
      },
      colors: {
        primary: {
          DEFAULT: '#009e91',
          dark: '#007a70',
          light: '#00b8a9',
          soft: 'rgba(0, 158, 145, 0.08)',
          mist: 'rgba(0, 158, 145, 0.05)',
          tint: 'rgba(0, 158, 145, 0.1)',
          muted: 'rgba(0, 158, 145, 0.6)'
        },
        ink: {
          DEFAULT: '#fd823b',
          dark: '#e66a1f',
          light: '#ff9a5c'
        }
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
