const presets = [
  [
    '@babel/preset-env',
    {
      useBuiltIns: 'usage',
    },
  ],
];

const plugins = ['transform-inline-environment-variables'];

module.exports = { presets, plugins };
