const { resolveFromRootDir } = require('../utils')

module.exports = [
    {
        test: /\.css$/,
        include: [resolveFromRootDir('src'), resolveFromRootDir('node_modules')],
        use: [
            'style-loader',
            {
                loader: 'cache-loader',
                options: {
                    cacheDirectory: resolveFromRootDir('.cache-loader')
                }
            },
            'css-loader'
        ]
    },
    {
        test: /\.scss$/,
        include: [resolveFromRootDir('src')],
        use: [
            'style-loader',
            {
                loader: 'cache-loader',
                options: {
                    cacheDirectory: resolveFromRootDir('.cache-loader')
                }
            },
            {
                loader: 'css-modules-typescript-loader'
            },
            {
                loader: 'css-loader',
                options: {
                    modules: {
                        mode: 'local',
                        localIdentName: '[local]--[hash:base64:8]'
                    }
                }
            },
            {
                loader: 'sass-loader',
                options: {
                    includePaths: [resolveFromRootDir('src/styles')]
                }
            }
        ]
    }
]
