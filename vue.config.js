/*
 * @Author: daidai
 * @Date: 2021-11-22 14:57:15
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-04-29 15:12:50
 */

const path = require('path');
function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  devServer: {
    proxy: {
      '/auth': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        pathRewrite: { '^/auth': '/auth' }
        },
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        pathRewrite: { '^/api': '/api' }
      }
    }
  },
  publicPath: '/screen/',
  outputDir: 'dist',
  assetsDir: '',
  filenameHashing: true,
  lintOnSave: false,
  runtimeCompiler: false,
  transpileDependencies: ['vue-echarts', 'resize-detector'],
  productionSourceMap: false,
  css: {
    extract: process.env.NODE_ENV === "production",
    sourceMap: false,
    loaderOptions: {
      sass: {
        prependData: `@import "@/assets/css/variable.scss";`
      }
    },
    requireModuleExtension: true
  },
  chainWebpack: (config) => {
    config.resolve.alias
        .set('@', resolve('src'))
        .set('assets', resolve('src/assets'))
        .set('assetsBig', resolve('src/pages/big-screen/assets'))
        .set('components', resolve('src/components'))
        .set('views', resolve('src/views'))
        .set('api', resolve('src/api'))
        .set('lib', resolve('src/lib'));

    if (process.env.NODE_ENV === "production") {
      config.optimization.delete("splitChunks");
    }
  },
  configureWebpack: config => {
    config.output.filename = "static/js/[name].[hash].js";
    config.output.chunkFilename = "static/js/[name].[hash].js";
    config.optimization = {
      splitChunks: {
        cacheGroups: {
          common: {
            name: "chunk-common",
            chunks: "initial",
            minChunks: 2,
            maxInitialRequests: 5,
            minSize: 0,
            priority: 1,
            reuseExistingChunk: true,
            enforce: true
          },
          element: {
            name: "chunk-element-ui",
            test: /[\\/]node_modules[\\/]element-ui[\\/]/,
            chunks: "all",
            priority: 3,
            reuseExistingChunk: true,
            enforce: true
          },
          yhhtUi: {
            name: "chunk-yhht-ui",
            test: /[\\/]node_modules[\\/]yhht-ui[\\/]/,
            chunks: "all",
            priority: 4,
            reuseExistingChunk: true,
            enforce: true
          },
          datav: {
            name: "chunk-datav",
            test: /[\\/]node_modules[\\/]@jiaminghi[\\/]data-view[\\/]/,
            chunks: "all",
            priority: 4,
            reuseExistingChunk: true,
            enforce: true
          }
        }
      }
    };
  },
  parallel: require('os').cpus().length > 1,
  pluginOptions: {}
}
