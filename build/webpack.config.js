const TsconfigPathsWebpackPlugin = require('tsconfig-paths-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const plugins = require('./plugins')
const jsRules = require('./rules/jsRules')
const styleRules = require('./rules/styleRules')
const fileRules = require('./rules/fileRules')
const { resolveFromRootDir } = require('./utils')

module.exports = {
    mode: process.env.APP_ENV,
    entry: {
        app: { import: resolveFromRootDir('src/index.tsx'), dependOn: 'shared' },
        shared: 'lodash'
    },
    devServer: {
        port: 9000,
        hot: true
    },
    output: {
        path: resolveFromRootDir('dist'),
        filename: '[name].js'
    },
    module: {
        rules: [...jsRules, ...styleRules, ...fileRules]
    },
    plugins: [...plugins],
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
    cache: {
        type: 'filesystem'
        // cacheLocation: resolveFromRootDir('.cache')
    },
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

        // splitChunks: {
        //     chunks: 'async',
        //     minSize: 20000,
        //     minRemainingSize: 0,
        //     maxSize: 0,
        //     minChunks: 1,
        //     maxAsyncRequests: 30,
        //     maxInitialRequests: 30,
        //     automaticNameDelimiter: '~',
        //     enforceSizeThreshold: 50000,
        //     cacheGroups: {
        //         defaultVendors: {
        //             test: /[\\/]node_modules[\\/]/,
        //             priority: -10
        //         },
        //         default: {
        //             minChunks: 2,
        //             priority: -20,
        //             reuseExistingChunk: true
        //         }
        //     }
        // },
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
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
    }
}
