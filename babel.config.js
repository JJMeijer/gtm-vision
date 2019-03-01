const presets = [
  [
    '@babel/preset-env',
    {
      useBuiltIns: 'usage',
    },
  ],
];

const plugins = [
  'react-hot-loader/babel',
];

module.exports = { presets, plugins };
