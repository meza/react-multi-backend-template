/* eslint-disable complexity, no-sync */
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import fs from 'fs';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import Dotenv from 'dotenv-webpack';
import postcssPresetEnv from 'postcss-preset-env';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import FaviconsWebpackPlugin from 'favicons-webpack-plugin';
import StylelintPlugin from 'stylelint-webpack-plugin';

const https = false;

const defaultPort = 3001;

import babelConfigGenerator from './scripts/babelConfigGenerator';

const babelCacheDirectory = path.join('../../.cache/babel', 'zoe-www-2');

import packageJson from './package.json';

const webpackConfig = (env, args) => {
  /**************************************** DIRECTORY PATHS *****************************************/
  const projectPath = fs.realpathSync(process.cwd());
  const resolveApp = (relativePath) =>
    path.resolve(projectPath, relativePath);
  const sourceDir = resolveApp('src');
  const mode = args.mode || 'development';
  const devMode = mode !== 'production';
  const babelConfig = babelConfigGenerator(false, mode);
  const finalWebpackConfig = {
    mode: mode,
    devtool: devMode ? 'eval-source-map' : 'nosources-source-map',
    entry: {
      main: `${sourceDir}/index.tsx`
    },
    output: {
      filename: devMode ? '[name].[hash].js' : '[name].[hash].js',
      chunkFilename: devMode ? 'static/js/[name].chunk.js' : 'static/js/[name].[hash].chunk.js',
      publicPath: '/'
    },
    resolve: {
      alias: {
        'react-dom': devMode ? '@hot-loader/react-dom' : 'react-dom'
      },
      extensions: ['.ts', '.tsx', '.js', '.mjs', '.json', '.jsx', '.d.ts']
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
          test: /\.(ts|tsx)$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                ...babelConfig,
                babelrc: false,
                cacheDirectory: babelCacheDirectory
              }
            }
          ]
        },
        {
          test: /\.(sass|scss)$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                esModule: true,
                hmr: devMode
              }
            },

            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: '[local]'
                },
                localsConvention: 'asIs',
                importLoaders: 2,
                sourceMap: true
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: () => [
                  postcssPresetEnv({
                    autoprefixer: { grid: true }
                  })
                ],
                sourceMap: true
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        },
        {
          test: /\.svg$/,
          use: ['@svgr/webpack']
        },
        {
          test: /\.(png|jpg|gif|eot|ttf|woff|woff2)$/,
          loader: 'url-loader',
          options: {
            name: 'assets/[name].[hash].[ext]',
            limit: 8192
          }
        },
        {
          loader: 'file-loader',
          exclude: [
            /\.(js(x)?|jpg|svg|ts(x)?|mjs|(s)?css)$/,
            /\.html$/,
            /\.json$/
          ],
          options: {
            name: '[name].[hash].[ext]',
            outputPath: 'static/media/'
          }
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: devMode ? '[name].css' : '[name].[contenthash].css',
        chunkFilename: devMode ? '[id].css' : '[id].[contenthash].css'
      }),
      new StylelintPlugin({
        lintDirtyModulesOnly: true,
        fix: true
      }),
      new Dotenv({
        systemvars: true,
        defaults: true
      }),
      new HtmlWebpackPlugin({
        isProduction: !devMode,
        version: packageJson.version,
        template: 'src/index.html'
      }),
      new FaviconsWebpackPlugin({
        logo: './images/logo.svg',
        cache: '../../.cache/favicons',
        favicons: {
          appName: 'Zoe',
          appDescription: 'Zoe - Streamer Assistant',
          developerURL: null,
          // eslint-disable-next-line camelcase
          theme_color: '#602080',
          version: packageJson.version
        }
      }),
      new CleanWebpackPlugin()
    ],
    devServer: {
      port: process.env.PORT || defaultPort,
      hot: devMode,
      inline: devMode,
      historyApiFallback: true,
      disableHostCheck: true,
      host: '0.0.0.0',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*'
      },
      overlay: {
        errors: true,
        warnings: true
      },
      https: https
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          styles: {
            name: 'styles',
            test: /\.css$/,
            chunks: 'all',
            enforce: true
          }
        }
      },
      minimizer: [
        new OptimizeCSSAssetsPlugin({
          cssProcessorPluginOptions: {
            preset: ['default', { discardComments: { removeAll: true } }]
          }
        }),
        new TerserPlugin({
          cache: true,
          parallel: true,
          sourceMap: true,
          /* eslint-disable @typescript-eslint/camelcase, camelcase */
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
          /* eslint-enable @typescript-eslint/camelcase, camelcase */
        })
      ]
    }
  };

  return finalWebpackConfig;
};

module.exports = webpackConfig;

/* eslint-enable */
