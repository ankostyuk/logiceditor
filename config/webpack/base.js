'use strict';

//
var path                = require('path'),
    webpack             = require('webpack'),
    ExtractTextPlugin   = require('extract-text-webpack-plugin'),
    HtmlWebpackPlugin   = require('html-webpack-plugin');

//
var ENV         = process.env.NODE_ENV,
    PRODUCTION  = ENV === 'production';

//
module.exports = function(options) {

    var cssLoader = {
        loader: 'css-loader',
        options: {
            minimize: PRODUCTION,
            discardComments: {
                removeAll: PRODUCTION
            }
        }
    };

    return {
        entry: {
            app: path.resolve(options.path, 'src/app/app.js')
        },

        output: {
            path: path.resolve(options.path, 'dist/app'),
            filename: 'js/[name].[chunkhash].js',
            publicPath: ''
        },

        resolve: require('./resolve')(options),

        module: {
            rules: [{
                test: /\.js$/,
                enforce: 'pre',
                exclude: [
                    /node_modules/,
                    /angular\/locales/
                ],
                use: [{
                    loader: 'eslint-loader',
                    options: {
                        failOnWarning: false,
                        failOnError: true
                    }
                }],
            }, {
                test: /\.css$/,
                use: ExtractTextPlugin.extract([cssLoader])
            }, {
                test: /\.less$/,
                use: ExtractTextPlugin.extract([cssLoader, 'less-loader'])
            }, {
                test: /\.(woff|woff2|svg)$/,
                loader: 'url-loader?name=static/[name].[hash].[ext]'
            }, {
                test: /\.(ttf|eot)$/,
                loader: 'file-loader?name=static/[name].[hash].[ext]'
            }, {
                test: /\.(html|txt)$/,
                loader: 'raw-loader'
            }, {
                test: /\.json$/,
                use: 'json-loader'
            }]
        },

        plugins: [
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                'window.jQuery': 'jquery'
            }),
            new ExtractTextPlugin('css/[name].[chunkhash].css'),
            new HtmlWebpackPlugin({
                template: path.resolve(options.path , 'src/app/index.html'),
                filename: 'index.html'
            }),
            new webpack.DefinePlugin({
                CONFIG: JSON.stringify({
                    'app.id': 'logiceditor',
                    PRODUCTION: PRODUCTION
                })
            })
        ].concat(PRODUCTION ? [
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: true
                },
                comments: false
            })
        ] : [])
    };
};
