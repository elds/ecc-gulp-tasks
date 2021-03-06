/* eslint func-style: 0 no-param-reassign:0 */

const _ = require('lodash');

/**
 * @deprecated
 * @constructor
 */
function HTMLTemplatePlugin() {}

HTMLTemplatePlugin.prototype.apply = function(compiler) {
    compiler.plugin('compilation', compilation => {
        compilation.plugin(
            'html-webpack-plugin-before-html-processing',
            (htmlPluginData, callback) => {
                // Remove all style tags from file
                htmlPluginData.html = htmlPluginData.html.replace(
                    /^\s*<link.*?href=".+?\.css".*?>\s*\r?\n?/gm,
                    ''
                );

                const chunks = _.get(htmlPluginData, 'assets.chunks', []);

                _.forEach(chunks, (chunk, name) => {
                    // Replace script tags that have a matching chunk name
                    const search = new RegExp(
                        `(<script.*?src=")${name}.js(".*?>(</script>)?)`,
                        'g'
                    );
                    htmlPluginData.html = htmlPluginData.html.replace(
                        search,
                        `$1${chunk.entry}$2`
                    );

                    // Add style tags if chunks contain styles
                    const css = _.get(chunk, 'css', []);
                    _.forEach(css, file => {
                        htmlPluginData.html = htmlPluginData.html.replace(
                            /(<\/head>)/,
                            `    <link rel="stylesheet" type="text/css" href="${file}">\n$1`
                        );
                    });
                });

                callback();
            }
        );
    });
};

module.exports = HTMLTemplatePlugin;
