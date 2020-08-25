const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

const getClientEnvironment = require('./env.js')
const env = getClientEnvironment('/')

const definePlugin = new webpack.DefinePlugin(env.stringified)

module.exports = [
    new HtmlWebpackPlugin({
        template: 'build/tpl/index.html'
    }),
    definePlugin,
    new ForkTsCheckerWebpackPlugin({
        tsconfig: require('path').join(__dirname, '../tsconfig.json'),
        eslint: true,
        async: false
    })
]
