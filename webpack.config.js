const path = require('path');

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'turtle3d.js',
    library: 'turtle3d'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
         exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
};
