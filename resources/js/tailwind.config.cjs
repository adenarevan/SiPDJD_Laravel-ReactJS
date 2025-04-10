module.exports = {
  
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.vue",

    
  ],
  safelist: ['border', 'border-red-500', 'bg-red-100', 'min-h-screen', 'min-h-full', 'h-full'],
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

