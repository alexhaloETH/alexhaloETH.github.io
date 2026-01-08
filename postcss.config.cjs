const cssnano = require('cssnano');
const purgecss = require('@fullhuman/postcss-purgecss');
const purgecssPlugin = purgecss.default ?? purgecss;
const purgeConfig = require('./purgecss.config.cjs');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  plugins: isProduction
    ? [
        purgecssPlugin({
          content: purgeConfig.content,
          safelist: purgeConfig.safelist,
        }),
        cssnano({ preset: 'default' }),
      ]
    : [],
};
