const TsconfigPathsWebpackPlugin = require('tsconfig-paths-webpack-plugin')

const plugins = require('./plugins')
const jsRules = require('./rules/jsRules')
const styleRules = require('./rules/styleRules')
const fileRules = require('./rules/fileRules')
const { resolveFromRootDir } = require('./utils')

module.exports = {
    mode: process.env.APP_ENV,
    entry: {
        app: resolveFromRootDir('src/index.tsx')
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
        ]
    },
    optimization: {
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
