// 打包wafer server
var fs = require('fs');
var path = require('path');
var glob = require('glob');
var utils = require('./utils')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

function getEntry (rootSrc, pattern) {
  var files = glob.sync(path.resolve(rootSrc, pattern))
  return files.reduce((res, file) => {
    var info = path.parse(file)
    var key = info.dir.slice(rootSrc.length + 1) + '/' + info.name
    res[key] = path.resolve(file)
    return res
  }, {})
}

// const appEntry = { app: resolve('./app.js')}
const pagesEntry = getEntry(resolve('./server'), './**/*');
// const JsonGroup = getEntry(resolve('./server','./**.json'));
// console.log(JsonGroup)
const entry = Object.assign({}, pagesEntry);
console.log(entry)
const outputPath = './dist/server';

module.exports = {
  entry,
  target: 'node',  // 默认为nodejs环境
  output: {
    path: resolve('./dist/server'),
    filename: '[name].js'
  },

  resolve: {
    extensions: [' ','.js', '.json'],
    alias: {
      '@': resolve('src')
    },
    symlinks: false,
    aliasFields: ['weapp', 'browser'],
    mainFields: ['browser', 'module', 'main'],
    descriptionFiles:['package.json']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [resolve('src'), resolve('test')],
        use: [
          'babel-loader'
        ]
      },
      {
        test: /\.json$/,
        use: 'json-loader'
      },
      {
        test: /\.md$/,
        use: [
            {
                loader: "html-loader"
            },
            {
                loader: "markdown-loader",
            }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name]].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[ext]')
        }
      }
    ]
  }
}
