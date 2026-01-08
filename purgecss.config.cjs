module.exports = {
  content: ['index.html', 'src/**/*.{js,jsx,ts,tsx,html}'],
  css: ['src/**/*.css'],
  safelist: {
    standard: [/^modal-/, /^card-/, /^btn-/, /^active$/, /^selected$/],
    deep: [/framer-motion/],
    greedy: [/animate-/]
  }
}
