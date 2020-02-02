module.exports = function (modules) {
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          corejs: "3.4.7",
          useBuiltIns: 'usage',
          modules: modules,
        }
      ],
      '@babel/typescript'
    ],
    plugins: [
      [
        '@babel/plugin-proposal-decorators',
        {
          legacy: true
        },
      ],
      '@babel/plugin-proposal-object-rest-spread',
      '@babel/plugin-syntax-import-meta',
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-transform-typescript'
    ]
  };
};
