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
  'prismjs', {
    languages: ['javascript', 'markup'],
    plugins: ['line-numbers'],
    theme: 'default',
    css: true,
  },
];

module.exports = { presets, plugins };
