const path = require('path')

var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: () => {
    return path.resolve(__dirname, './src/index.js')
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
 
  },
  module: {
    // rules: [
    //   {
    //     test: /\.css$/,
    //     use: [
    //       {
    //         loader: './myLoader/index.js'
    //       },
    //       'css-loader'
    //     ]
    //   },
    //   {
    //     test: /\.js$/,
    //     exclude: /node_modules/,
    //     use: [
    //       {
    //         loader: './myLoader/1.js'
    //       },
    //       {
    //         loader: 'babel-loader',
    //         options: {
    //           presets: ['@babel/preset-env'] // 预设
    //         }
    //       },
         
    //     ]
    //   }
    // ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.html')
    })
  ],
  devtool: 'source-map',
  mode: 'development',
  devServer: {
    // port: 8000,
    open: true
  }
}