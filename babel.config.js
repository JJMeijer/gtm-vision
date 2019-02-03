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
  [
    '@babel/plugin-transform-runtime',
    {
      helpers: true,
      regenerator: true,
    },
  ],
];

module.exports = { presets, plugins };
