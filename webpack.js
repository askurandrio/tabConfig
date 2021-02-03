const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const baseManifest = require("./src/resources/manifest.json");
const WebpackExtensionManifestPlugin = require("webpack-extension-manifest-plugin");
const CopyPlugin = require("copy-webpack-plugin");
var ZipPlugin = require('zip-webpack-plugin');

module.exports = {
  mode: "development",
  devtool: "cheap-module-source-map",
  entry: {
    popup: path.join(__dirname, "./src/popup/index.js"),
    background: path.join(__dirname, "./src/background/index.js"),
  },
  output: {
    path: path.resolve(__dirname, "./build"),
    filename: "[name].js"
  },
  resolve: {
    extensions: ["*", ".js"]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src", "popup", "index.html")
    }),
    new WebpackExtensionManifestPlugin({
      config: {
        base: baseManifest
      }
    }),
    new CopyPlugin({
      patterns: [
        { from: "src/resources/icon.png", to: "icon.png" },
        { from: "src/resources/spinner.svg", to: "spinner.svg" },
      ]
    }),
    new ZipPlugin({
    	filename: 'build.zip',
    	path: '../'
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader"]
      }
    ]
  }
};
