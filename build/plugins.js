const HtmlWebpackPlugin = require('html-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')

const getClientEnvironment = require('./env.js')
const env = getClientEnvironment('/')

const definePlugin = new webpack.DefinePlugin(env.stringified)

const plugins = [
    new HtmlWebpackPlugin({
        template: 'build/tpl/index.html'
    }),
    definePlugin,
    new ForkTsCheckerWebpackPlugin({
        tsconfig: require('path').join(__dirname, '../tsconfig.json'),
        eslint: true,
        // 设置为false编译中途直接报告问题
        async: false
    }),
    new webpack.ProvidePlugin({
        process: 'process/browser'
    })
]

if (process.env.APP_ENV === 'production') {
    plugins.push(new MiniCssExtractPlugin())
}

module.exports = plugins
