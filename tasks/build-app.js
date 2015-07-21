var gutil = require('gulp-util');
var webpack = require('webpack');
var definePlugin = require('../util/definePlugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function(config, callback) {
    var wpConfig = config.webpackConfig.application;
    // use production optimizations
    var optimizations = [
        definePlugin,
        new ExtractTextPlugin('style.css'),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            output: {
                comments: false,
            },
            compress: {
                warnings: false,
                screw_ie8: true,
            },
            mangle: {
                screw_ie8: true,
            },
        }),
    ];
    if (wpConfig.plugins) {
        wpConfig.plugins = wpConfig.plugins.concat(optimizations);
    } else {
        wpConfig.plugins = optimizations;
    }
    // remove linting
    delete wpConfig.module.preLoaders;
    // run webpack
    webpack(wpConfig, function(err, stats) {
        if (err) {
            throw new gutil.PluginError('webpack', err);
        }
        // only log when errors
        gutil.log('[webpack]: ', stats.toString({
            chunks: false,
            modules: false,
            colors: true,
        }));
        callback();
    });
};
