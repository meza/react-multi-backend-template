module.exports = function (modules, mode = 'production') {
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          corejs: '3.4.7',
          useBuiltIns: 'usage',
          modules: modules
        }
      ],
      '@babel/typescript',
      '@babel/preset-react'
    ],
    plugins: [
      [
        '@babel/plugin-proposal-decorators',
        {
          legacy: true
        }
      ],
      '@babel/plugin-proposal-object-rest-spread',
      '@babel/plugin-syntax-import-meta',
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-transform-typescript',
      (mode !== 'production') && 'react-hot-loader/babel'
    ].filter(Boolean)
  };
};
