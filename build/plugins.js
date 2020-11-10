const HtmlWebpackPlugin = require('html-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')

const getClientEnvironment = require('./env.js')
const env = getClientEnvironment('/')
const { assetsPath } = require('./utils')

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
    plugins.push(
        new MiniCssExtractPlugin({
            filename: assetsPath('css/[name].[contenthash].css'),
            chunkFilename: assetsPath('css/[name].[id].[contenthash].css')
        })
    )
} else {
    plugins.push(
        new webpack.DllReferencePlugin({
            manifest: require('./build/library/library.json')
        })
    )
}

module.exports = plugins
