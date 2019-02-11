const presets = [
  [
    '@babel/preset-env',
    {
      useBuiltIns: 'usage',
    },
  ],
];

const plugins = [
  'transform-inline-environment-variables',
  'react-hot-loader/babel',
];

module.exports = { presets, plugins };
