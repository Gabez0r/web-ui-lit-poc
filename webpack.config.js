const { resolve, join } = require('path');
const merge = require('webpack-merge')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const TSLintPlugin = require('tslint-webpack-plugin');

const ENV = process.argv.find(arg => arg.includes('production'))
  ? 'production'
  : 'development';

const TARGET = ENV === 'production' ? resolve('dist') : resolve('src');

const polyfills = [
  {
    from: 'node_modules/@webcomponents/webcomponentsjs/*.{js,map}',
    to: join(TARGET, 'vendor/webcomponentsjs'),
    flatten: true
  }
];

const common = merge([
  {
    entry: './src/index.ts',
    output: {
      filename: '[name].[chunkhash:8].js',
      path: TARGET
    },
    mode: ENV,
    module: {
      rules: [
        // fix import.meta
        {
          test: /\.js$/,
          loader: require.resolve('@open-wc/webpack-import-meta-loader/webpack-import-meta-loader.js'),
        },
        {
          test: /\.ts$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
  }
]);

const development = merge([
  {
    devtool: 'cheap-module-source-map',
    plugins: [
      new CopyWebpackPlugin(polyfills),
      new HtmlWebpackPlugin({
        template: 'index.html'
      }),
      new TSLintPlugin({
        files: ['./src/**/*.ts'],
        config: './tslint.json',
        fix: true
      }),
    ],
    devServer: {
      contentBase: TARGET,
      compress: true,
      overlay: true,
      port: 5000,
      host: '0.0.0.0',
      historyApiFallback: true,
      proxy: {
        '/nuxeo': {
          target: 'http://localhost:8080/',
        }
      }
    }
  }
]);

const analyzer = process.argv.find(arg => arg.includes('--analyze')) ? [new BundleAnalyzerPlugin()] : [];

const production = merge([
  {
    optimization: {
      splitChunks: {
        chunks: 'all'
      }
    },
    plugins: [
      new CleanWebpackPlugin([TARGET], { verbose: true }),
      new HtmlWebpackPlugin({
        template: resolve('index.html')
      }),
      new CopyWebpackPlugin([
        ...polyfills,
        { from: 'manifest.json' },
        { from: 'images', to: 'images' },
      ]),
      new TSLintPlugin({
        files: ['./src/**/*.ts'],
        config: './tslint.prod.json',
        warningsAsError: true,
        waitForLinting: true
      }),
      ...analyzer
    ]
  }
]);

module.exports = mode => merge(common, mode === 'production' ? production : development, { mode });
