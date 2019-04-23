var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var path = require("path");

module.exports = {
  devtool: 'eval-source-map',
  entry: ["babel-polyfill", "./main.jsx"],
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "bundle.js"
  },
  resolve: {
    extensions: ["", ".js", ".jsx"]
  },
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: "json"
      },
        {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel',

            plugins: [
                'react-transform', {
                    transforms: [{
                        transform: 'react-transform-hmr',
                        imports: ['react'],
                        locals: ['module']
                    }]
                }
            ],
        },
      {
        test: /\.css$/,
        include: [/node_modules/, /styles_custom/],
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.css$/,
        exclude: [/node_modules/, /styles_custom/],
        loader: 'style-loader!css-loader?modules'
      },
      { test: /\.(png|jpg)$/,
        loader: 'url-loader?limit=500000'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      VERSION: JSON.stringify("0.1-dev")
    }),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({title: 'Geodashboard', hash: true, template: 'public/index.html'})
  ],
  devServer: {
  	contentBase: "./public",
    colors: true,
    historyApiFallback: true,
    inline: true,
    hot: true
  }
}
