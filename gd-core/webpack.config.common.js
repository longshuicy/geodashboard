// @flow
const webpackMerge = require('webpack-merge');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const commonConfigBase = require('../webpack.config.common');

module.exports = webpackMerge(
    commonConfigBase,
    {
        plugins: [
            new FaviconsWebpackPlugin({
                logo: './src/images/favicon.png',
                prefix: 'icons/',
                emitStats: false,
                inject: true
            })
        ]
    }
);