'use strict'
const webpack = require('webpack')
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')
const vuxLoader = require('vux-loader')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

let webpackConfig = {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: './src/main.js',
    // vendor: ['vconsole', 'vant', 'muse-ui']
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json', '.ts', '.tsx'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      'src': resolve('src'),
      'assets': resolve('src/assets'),
      '~assets': resolve('assets'),
      'components': resolve('src/components'),
      'snapsvg': 'snapsvg/dist/snap.svg.js',
    }
  },
  module: {
    rules: [
      ...(config.dev.useEslint ? [{
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter'),
          emitWarning: !config.dev.showEslintErrorsInOverlay
        }
      }] : []),
      {
        test: /\.ts$/,
        exclude: /node_modules|vue\/src/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/]
        }
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        enforce: 'pre',
        loader: 'tslint-loader'
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
          {
            loader: 'ts-loader',
            options: {appendTsxSuffixTo: [/\.vue$/]}
          }
        ]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          resolve('src'),
          resolve('test'),
          resolve('node_modules/vux/packages'),
          resolve('node_modules/vant/packages'),
          resolve('node_modules/iview/packages'),
          resolve('node_modules/muse-ui/packages'),
          resolve('node_modules/webpack-dev-server'),
          resolve('node_modules/vue-echarts'),
          resolve('node_modules/resize-detector')
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },
      // {
      //   test: resolve('src/libs/zepto.min.js'),
      //   loader: 'exports-loader?window.$!script-loader'
      // },
      // {
      //   test: resolve('static/libs/Eleditor/Eleditor.min.js'),
      //   loader: 'exports-loader?window.Eleditor!script-loader'
      // },
      {
        test: require.resolve('snapsvg/dist/snap.svg.js'),
        use: 'imports-loader?this=>window,fix=>module.exports=0',
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      // $: resolve('src/libs/zepto.min.js'),
      // Zepto: resolve('src/libs/zepto.min.js'),
      // 'window.Zepto': resolve('src/libs/zepto.min.js')
      // 'window.Eleditor': resolve('static/libs/Eleditor/Eleditor.min.js')
    })
  ],
  externals: {
    jquery: "jQuery"
  }
}

const vuxConfig = require('./vux-config')

module.exports = vuxLoader.merge(webpackConfig, vuxConfig)
