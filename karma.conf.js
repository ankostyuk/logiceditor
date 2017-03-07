'use strict';

//
var webpack = require('webpack');

module.exports = function(config) {

    config.set({
        // browsers: ['Chrome'],
        browsers: ['PhantomJS'],

        singleRun: true,
        frameworks: ['chai', 'jasmine'],
        reporters: ['mocha'],

        files: [
            'src/app/app.js',
            'node_modules/angular-mocks/angular-mocks.js', // TODO remove?
            'test/unit/**/*.spec.js'
        ],

        preprocessors: {
            'src/**/*.js': ['webpack', 'sourcemap'],
            'test/unit/**/*.spec.js': ['webpack', 'sourcemap']
        },

        webpack: {
            resolve: require(__dirname + '/config/webpack/resolve')({
                path: __dirname
            }),
            devtool: 'inline-source-map',
            module: {
                rules: [{
                    test: /\.(css|less|woff|woff2|svg|ttf|eot|html)$/, loader: 'file-loader'
                }, {
                    test: /\.txt$/,
                    loader: 'raw-loader'
                }]
            },
            plugins: [
                new webpack.ProvidePlugin({
                    $: 'jquery',
                    jQuery: 'jquery',
                    'window.jQuery': 'jquery'
                }),
                new webpack.DefinePlugin({
                    CONFIG: JSON.stringify({
                        'app.id': 'logiceditor',
                        PRODUCTION: false
                    })
                })
            ]
        },

        webpackMiddleware: {
            stats: 'errors-only'
        }
    });
};
