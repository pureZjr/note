const { resolveFromRootDir } = require('../utils')

module.exports = [
    {
        test: /\.css$/,
        include: [resolveFromRootDir('src'), resolveFromRootDir('node_modules')],
        use: ['style-loader', 'css-loader']
    },
    {
        test: /\.scss$/,
        include: [resolveFromRootDir('src')],
        use: [
            'style-loader',
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
                    sassOptions: {
                        // 缩进宽度
                        indentWidth: 4,
                        includePaths: [resolveFromRootDir('src/styles')]
                    }
                }
            }
        ]
    }
]
