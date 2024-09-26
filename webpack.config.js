const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: "./client/index.html",
  filename: "index.html",
  inject: "body",
});

module.exports = {
  mode: "development",
  entry: "./client/index.js", // Your entry point
  output: {
    path: path.resolve(__dirname, "dist"), // Output directory
    filename: "bundle.js", // Output filename
  },

  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    port: 8080,
    hot: true,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: "babel-loader",
        exclude: [/node_modules/, /__tests__/],
      },
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".json"],
  },
  plugins: [HtmlWebpackPluginConfig, new Dotenv()],
};

//webpack.config.js

// const path = require('path');

// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
//   template: './client/index.html',
//   filename: 'index.html',
//   inject: 'body'
// })

// module.exports = {
//     mode: 'development',
//   entry: './client/index.js',
//   output: {
//     path: path.resolve('dist'),
//     filename: 'index_bundle.js'
//   },
//   module: {
//     rules: [
//       { test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ },
//       { test: /\.jsx$/, use: 'babel-loader', exclude: /node_modules/ },
//       { test: /\.css$/, use: ['style-loader','css-loader'],
//       },
//     ]
//   },
//   plugins: [HtmlWebpackPluginConfig]
// }
