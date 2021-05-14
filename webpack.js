const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseManifest = require('./src/resources/manifest.json');
const WebpackExtensionManifestPlugin = require('webpack-extension-manifest-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const fs = require('fs');
const yazl = require('yazl');
const package = require('./package.json');


module.exports = {
  mode: 'production',
  devtool: null,
  entry: {
    popup: path.join(__dirname, './src/popup/index.js'),
    background: path.join(__dirname, './src/background/index.js'),
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['*', '.js']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'popup', 'index.html')
    }),
    new WebpackExtensionManifestPlugin({
      config: {
        base: baseManifest,
        extend: {
            version: package.version
        }
      }
    }),
    new CopyPlugin({
      patterns: [
        { from: 'src/background/background.html', to: 'background.html' },
        { from: 'src/resources/icon.png', to: 'icon.png' },
        { from: 'src/resources/spinner.svg', to: 'spinner.svg' },
      ]
    }),
    new (class BuildZip {
        async process() {
            const zipfile = new yazl.ZipFile();
            const filenames = await new Promise((resolve, reject) => {
              fs.readdir('./build', (err, filenames) => {
                if(err) {
                  reject(err);
                  return
                }
                resolve(filenames)
              })
            })
            for(const filename of filenames) {
              zipfile.addFile(path.join('./build', filename), filename)
            }
            const fileStream = fs.createWriteStream('build.zip');
            const zipStream = zipfile.outputStream.pipe(fileStream);
            const onClose = new Promise(resolve => zipStream.on('close', resolve));
            zipfile.end();
            await onClose;
        }

        apply(compiler) {
          compiler.hooks.done.tapAsync(
            'BuildZip',
            (compilation, callback) => {
              this.process().then(() => callback());
            }
          );
        }
    })()
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader']
      }
    ]
  }
}
