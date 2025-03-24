module.exports = {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.vue",
  ],
  theme: {
    extend: {

      fontFamily: {
        dm: ['DM Sans', 'sans-serif'],
        manrope: ['Manrope', 'sans-serif'],
},
    },

  },
  plugins: [],
  important: true, // Tambahin ini biar Tailwind gak override CSS lo
};

