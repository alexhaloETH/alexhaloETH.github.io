// Minify CSS in production builds. PurgeCSS used to run here too, but it silently
// dropped selectors made only of pseudo-classes (like :focus-visible, which removed
// every keyboard focus ring in production). The stylesheet is small now, so it went.
const cssnano = require('cssnano');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  plugins: isProduction ? [cssnano({ preset: 'default' })] : [],
};
