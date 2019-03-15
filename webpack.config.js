var path = require('path');

module.exports = {
  mode: 'development',
  entry: './views_html/list/list.js',
  output: {
    filename: 'ui.list.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist'
  },
  watch: true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
    ignored: /node_modules/
  },
  module: {
    rules: [{
      test: /\.js$/,
      include: path.resolve(__dirname, 'src'),
      use: {
        loader: "babel-loader",
        options: {
          presets: [
            ["env", {
              "targets": {
                "browsers": ["last 2 versions"]
              }
            }]
          ]
        }
      }
    }]
  }
};
