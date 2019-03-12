var path = require('path');
const webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

const os = require('os');

var networkInterfaces = os.networkInterfaces();

const address = networkInterfaces['Wi-Fi'][1].address;
const apiUrl = 'http://' + address + ':4000';

module.exports = {
  mode: 'development',
  resolve: {
    extensions: ['.js', '.vue']
  },
  module: {
    rules: [
      {
        test: /\.vue?$/,
        exclude: /(node_modules)/,
        use: 'vue-loader'
      },
      {
        test: /\.js?$/,
        exclude: /(node_modules)/,
        use: 'babel-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    })
  ],
  devServer: {
    historyApiFallback: true,
    host: address, //your ip address
    port: 8080
  },
  externals: {
    // global app config object
    config: JSON.stringify({
      apiUrl: apiUrl
    })
  }
};
