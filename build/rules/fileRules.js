const { resolveFromRootDir, assetsPath } = require('../utils')

module.exports = [
    {
        test: /\.(png|jpg|gif|jpeg)$/i,
        type: 'asset',
        generator: { filename: 'imgs/[hash:7].[ext][query]' },
        parser: {
            dataUrlCondition: {
                maxSize: 4 * 1024, // 4kb，单位为 byte，默认值为 8kb
            },
        },
    },
    {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        type: 'asset/resource',
        generator: { filename: 'fonts/[hash:7].[ext][query]' },
    },
]
