const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
    innerGraph: false,
    minimize: true,
    minimizer: [
        new TerserPlugin({
            // 匹配需要压缩的文件、可以指定文件夹
            // 默认开启并行提高构建速度
            parallel: true,
            terserOptions: {
                // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
            },
            extractComments: false
        })
    ],
    splitChunks: {
        chunks: 'all',
        cacheGroups: {
            // 禁用默认缓存
            default: false,
            vendor: {
                name: 'vendor',
                // 包含同步和异步
                chunks: 'all',
                // 最少被引用两次
                minChunks: 2,
                // 优先级
                priority: 10,
                // 最小大小
                minSize: 0,
                test: /[\\/]node_modules[\\/]/
            },
            reactBase: {
                name: 'reactBase',
                test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
                priority: 11,
                minChunks: 1,
                minSize: 0
            },
            mobxBase: {
                name: 'mobxBase',
                test: /[\\/]node_modules[\\/](mobx|mobx-react|mobx-react-router)[\\/]/,
                priority: 12,
                minChunks: 1,
                minSize: 0
            },
            other: {
                name: 'react-ace',
                test: /[\\/]node_modules[\\/](react-ace)[\\/]/,
                priority: 13,
                minChunks: 1,
                minSize: 0
            },
            wangeditor: {
                name: 'wangeditor',
                test: /[\\/]node_modules[\\/](wangeditor)[\\/]/,
                priority: 14,
                minChunks: 1,
                minSize: 0
            }
        }
    },
    runtimeChunk: true
}
