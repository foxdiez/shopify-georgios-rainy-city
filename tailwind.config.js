/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.liquid"],
  theme: {
    extend: {
    },
    fontSize: {
      paragraph: ['15px', '19px'],
      heading: ['30px', '40px'],
      span: ['16px', '19.6px'],
    },
    colors: {
      'transparent': 'transparent',
      'black': '#000000',
      'white': '#ffffff',
      'dark-grey': '#101010',
      'pink': {
        50: '#D8369633',
        100: '#E977C2',
        200: '#E33B9F',
        500: '#D83696',
      },
    },
  },
  plugins: [],
}

