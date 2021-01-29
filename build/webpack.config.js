const TsconfigPathsWebpackPlugin = require('tsconfig-paths-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const plugins = require('./plugins')
const jsRules = require('./rules/jsRules')
const styleRules = require('./rules/styleRules')
const fileRules = require('./rules/fileRules')
const { APP_ENV } = require('./constants')
const { resolveFromRootDir, assetsPath } = require('./utils')
const { assetsRoot } = require('./config')

const config = {
    mode: APP_ENV,
    entry: {
        app: { import: resolveFromRootDir('src/index.tsx'), dependOn: 'shared' },
        shared: 'lodash'
    },
    devServer: {
        hot: true,
        liveReload: false,
        port: 9000
    },
    output: {
        path: assetsRoot,
        filename: APP_ENV === 'production' ? assetsPath('js/[name].[chunkhash:19].js') : '[name].js'
    },
    module: {
        rules: [...jsRules, ...styleRules, ...fileRules]
    },
    plugins: [
        ...plugins
        // new BundleAnalyzerPlugin()
    ],
    resolve: {
        extensions: ['.ts', '.tsx', '.js', 'jsx'],
        plugins: [
            new TsconfigPathsWebpackPlugin({
                configFile: resolveFromRootDir('tsconfig.json')
            })
        ],
        fallback: { path: require.resolve('path-browserify') }
    },
    // 开启缓存，加快开发环境构建速度

    optimization: {
        innerGraph: false,
        minimize: true,
        minimizer: [
            new TerserPlugin({
                // 匹配需要压缩的文件、可以指定文件夹
                // 提供include、exclude
                test: /\.js(\?.*)?$/i,
                // 默认开启并行提高构建速度
                parallel: true,
                terserOptions: {
                    // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
                }
            })
        ],
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                // 禁用默认缓存
                default: false,
                buildup: {
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/]/
                },
                reactBase: {
                    name: 'reactBase',
                    test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
                    chunks: 'all',
                    priority: 10
                },
                mobxBase: {
                    name: 'mobxBase',
                    test: /[\\/]node_modules[\\/](mobx|mobx-react|mobx-react-router)[\\/]/,
                    chunks: 'all',
                    priority: 9
                }
            }
        },
        runtimeChunk: true
    },
    devtool: 'inline-source-map'
}

// 开启缓存，加快开发环境构建速度
if (process.env.NODE_ENV === 'development') {
    config.cache = {
        type: 'filesystem',
        cacheLocation: resolveFromRootDir('.cache')
    }
}

module.exports = config
