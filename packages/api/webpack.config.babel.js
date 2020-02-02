import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import fs from 'fs';
import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import ZipPlugin from 'zip-webpack-plugin';
import NodemonPlugin from 'nodemon-webpack-plugin';

import babelConfigGenerator from './scripts/babelConfigGenerator';
const babelConfig = babelConfigGenerator(false);

const webpackConfig = (env, args) => {
  /**************************************** DIRECTORY PATHS *****************************************/
  // eslint-disable-next-line no-sync
  const projectPath = fs.realpathSync(process.cwd());
  const resolveApp = (relativePath) =>
    path.resolve(projectPath, relativePath);
  const sourceDir = resolveApp('src');
  const mode = args.mode || 'development';
  const devMode = mode !== 'production';

  const finalWebpackConfig = {
    mode: mode,
    devtool: devMode ? 'eval-source-map' : 'nosources-source-map',
    entry: {
      server: `${sourceDir}/index.ts` // has to be server.js for beanstalk to work
    },
    target: 'node',
    output: {
      filename: '[name].js',
      chunkFilename: devMode ? 'static/js/[name].chunk.js' : 'static/js/[name].[hash].chunk.js',
      publicPath: '/'
    },
    resolve: {
      extensions: ['.ts', '.js', '.mjs', '.json', '.d.ts']
    },
    performance: {
      hints: false
    },
    stats: {
      all: false,
      assets: true,
      assetsSort: 'size',
      builtAt: true,
      children: true,
      env: true,
      timings: true,
      errors: true,
      warnings: true,
      errorDetails: true,
      performance: false
    },
    module: {
      rules: [
        {
          test: /\.(ts)$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                ...babelConfig,
                babelrc: false
              }
            },
            {
              loader: 'eslint-loader',
              options: {
                fix: devMode
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new NodemonPlugin({
        nodeArgs: ['--inspect']
      }),
      new ZipPlugin({
        filename: 'extra-life-api.zip'
      })
    ],
    optimization: {
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: true,
          sourceMap: true,
          /* eslint-disable camelcase, @typescript-eslint/camelcase */
          terserOptions: {
            ecma: 6,
            warnings: false,
            parse: {},
            compress: {
              inline: true,
              drop_console: true,
              dead_code: true,
              sequences: true,
              passes: 1,
              conditionals: true,
              booleans: true,
              unused: true,
              if_return: true,
              join_vars: true
            },
            mangle: !devMode,
            module: false,
            output: {
              comments: false
            },
            toplevel: false,
            nameCache: null,
            ie8: false,
            keep_classnames: false,
            keep_fnames: false,
            safari10: false
          }
          /* eslint-enable camelcase, @typescript-eslint/camelcase */
        })
      ]
    },
    node: {
      net: false,
      fs: false,
      tls: false,
      fetch: true
    }
  };

  return finalWebpackConfig;
};

module.exports = webpackConfig;
