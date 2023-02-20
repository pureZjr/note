const { resolveFromRootDir, assetsPath } = require('../utils')

module.exports = [
    {
        test: /\.(png|jpg|gif|jpeg)$/i,
        use: [
            {
                loader: 'url-loader',
                options: {
                    limit: 8192,
                    esModule: false,
                    name: assetsPath(`imgs/[name].[hash:7].[ext]`),
                },
            },
        ],
    },
    {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
            {
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'fonts/',
                },
            },
        ],
    },
]
