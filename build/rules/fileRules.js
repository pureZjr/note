const { resolveFromRootDir, assetsPath } = require('../utils')

module.exports = [
    {
        test: /\.svg$/,
        loader: '@svgr/webpack',
        include: resolveFromRootDir('src')
    },
    {
        test: /\.(png|jpg|gif|jpeg)$/i,
        use: [
            {
                loader: 'url-loader',
                options: {
                    limit: 8192,
                    esModule: false,
                    name: assetsPath(`imgs/[name].[hash:7].[ext]`)
                }
            }
        ]
    }
]
