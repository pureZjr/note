const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const { resolveFromRootDir } = require('../utils')
const theme = require(resolveFromRootDir('theme.js'))

const commonLoader = process.env.APP_ENV === 'production' ? MiniCssExtractPlugin.loader : 'style-loader'

module.exports = [
    {
        test: /\.css$/,
        include: [resolveFromRootDir('src'), resolveFromRootDir('node_modules')],
        use: [
            commonLoader,
            {
                loader: 'css-loader',
                options: {
                    esModule: false
                }
            }
        ]
    },
    {
        test: /\.scss$/,
        include: [resolveFromRootDir('src')],
        use: [
            commonLoader,
            {
                loader: 'css-modules-typescript-loader'
            },
            {
                loader: 'css-loader',
                options: {
                    esModule: false,
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
    },
    {
        test: /\.less$/,
        include: [resolveFromRootDir('node_modules')],
        use: [
            commonLoader,
            {
                loader: 'css-loader',
                options: {
                    esModule: false
                }
            },
            {
                loader: 'less-loader',
                options: {
                    lessOptions: {
                        // 禁用内联js代码，禁止在样式表用js代码
                        javascriptEnabled: true,
                        modifyVars: theme
                    }
                }
            }
        ]
    }
]
