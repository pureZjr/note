const HtmlWebpackPlugin = require('html-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')
// const SentryPlugin = require('webpack-sentry-plugin')

const getClientEnvironment = require('./env.js')
const env = getClientEnvironment('/')
const { assetsPath, resolveFromRootDir } = require('./utils')
const { APP_ENV } = require('./constants')

const definePlugin = new webpack.DefinePlugin(env.stringified)

const plugins = [
    new HtmlWebpackPlugin({
        template: 'build/tpl/index.html',
    }),
    definePlugin,
    new ForkTsCheckerWebpackPlugin({
        typescript: {
            configFile: resolveFromRootDir('tsconfig.json'),
        },
        // 设置为false编译中途直接报告问题
        async: APP_ENV === 'development',
    }),
    new webpack.ProvidePlugin({
        process: 'process/browser',
    }),
]

if (APP_ENV === 'production') {
    plugins.push(
        new MiniCssExtractPlugin({
            filename: assetsPath('css/[name].[contenthash].css'),
            chunkFilename: assetsPath('css/[name].[id].[contenthash].css'),
        })
        // 不用source-map了，影响打包
        // new SentryPlugin({
        //     // Sentry options are required
        //     organization: 'sentry',
        //     project: 'note',
        //     apiKey: 'b32e841b982a417ba16be5af9a8278267f13410221b249a2b563a771359883fa',
        //     // 上传完source-map删除当前目录下的source-map
        //     deleteAfterCompile: true,
        //     // 自己搭建的sentry
        //     baseSentryURL: 'http://sentry.purevivi.chat/api/0/',
        //     release: function(hash) {
        //         return hash // webpack build hash
        //     }
        // })
    )
}

module.exports = plugins
