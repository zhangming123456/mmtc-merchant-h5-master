'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

// const env = process.env.NODE_ENV === 'testing'
//   ? require('../config/test.env')
//   : require('../config/prod.env')

function getModuleName (module) {
  var sign = 'node_modules';
  var signIndex = module.resource.indexOf(sign);
  var pathSeparator = module.resource.slice(signIndex - 1, signIndex);
  var modulePath = module.resource.substring(signIndex + sign.length + 1);
  var moduleName = modulePath.substring(0, modulePath.indexOf(pathSeparator));
  moduleName = moduleName.toLowerCase();

  return moduleName
}

const env = process.env.NODE_ENV === 'production'
  ? require('../config/prod.env')
  : config.build[process.env.env_config + 'Env']

const webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      usePostCSS: true
    })
  },
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    // UglifyJs do not support ES6+, you canvas2Image also use babel-minify for better treeshaking: https://github.com/babel/minify
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_debugger: true,
        drop_console: true,
        pure_funcs: ['console.log']
      },
      sourceMap: config.build.productionSourceMap,
      parallel: true
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      // set the following option to `true` if you want to extract CSS from
      // codesplit chunks into this main css file as well.
      // This will result in *all* of your app's CSS being loaded upfront.
      allChunks: false,
    }),
    // generate dist index.html with correct asset hash for caching.
    // you canvas2Image customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: process.env.NODE_ENV === 'testing'
        ? 'index.html'
        : config.build.index,
      template: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // hash: true,
      // chunks: ['manifest', 'flyio', 'vue', 'vendor', 'components', 'tools', 'app'],
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      // chunksSortMode: 'dependency',
      // chunksSortMode: 'manual',
      chunksSortMode: function (chunk1, chunk2) {
        var order = ['manifest', 'flyio', 'vue', 'vendor', 'components', 'tools', 'app'];
        var order1 = order.indexOf(chunk1.names[0]);
        var order2 = order.indexOf(chunk2.names[0]);
        return order1 - order2;
      }
    }),
    // keep module.id stable when vender modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // enable scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module) {
        // any required modules inside node_modules are extracted to vendor
        // node_modules中的任何必需模块都将解压缩到供应商
        return (
          module.resource && /\.js$/.test(module.resource) && module.resource.indexOf(path.join(__dirname, '../node_modules')) === 0
        )
      }
    }),

    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'flyio',
      chunks: ['app', 'vendor'],
      minChunks: function (module, count) {
        return module.resource && ~['flyio'].indexOf(getModuleName(module)) && count >= 1
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vue',
      chunks: ['app', 'vendor'],
      minChunks: function (module, count) {
        return module.resource && ~['vue', 'vue-router'].indexOf(getModuleName(module)) && count >= 1
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'components',
      chunks: ['app', 'vendor'],
      minChunks: function (module, count) {
        return module.resource && ~['vant', 'muse-ui'].indexOf(getModuleName(module)) && count >= 1
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'tools',
      chunks: ['app', 'vendor'],
      minChunks: function (module, count) {
        return module.resource && ~['vuescroll', 'vconsole'].indexOf(getModuleName(module)) && count >= 1
      }
    }),
    // This instance extracts shared chunks from code splitted chunks and bundles them
    // 此实例从代码拆分的块中提取共享块并将它们捆绑在一起
    // in a separate chunk, similar to the vendor chunk
    // 一个单独的块，类似于供应商块
    // see: https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      async: 'vendor-async',
      children: true,
      minChunks: 3
    }),
    // copy custom static assets
    // 复制自定义静态资产
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

// if (config.build.productionGzip) {
//   const CompressionWebpackPlugin = require('compression-webpack-plugin')
//
//   webpackConfig.plugins.push(
//     new CompressionWebpackPlugin({
//       asset: '[path].gz[query]',
//       algorithm: 'gzip',
//       test: new RegExp(
//         '\\.(' +
//         config.build.productionGzipExtensions.join('|') +
//         ')$'
//       ),
//       threshold: 10240,
//       minRatio: 0.8
//     })
//   )
// }

module.exports = webpackConfig
