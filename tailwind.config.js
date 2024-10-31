/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');
export default {
  content: ['./src/**/*.{html,js,svelte,ts}',"./public/**/*.html"],
  safelist: [
    // ใช้สีทั้งหมดจาก Tailwind CSS
    ...Object.keys(colors).flatMap(color =>
      Object.keys(colors[color]).map(shade => `bg-${color}-${shade}`)
    ),
    // เพิ่มคลาสอื่น ๆ ที่ต้องการที่นี่
  ],
  theme: {
    extend: {
      colors: {
    
      }
    },
  },
  plugins: [],
}

