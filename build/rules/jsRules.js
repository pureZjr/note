const tsImportPluginFactory = require('ts-import-plugin')

const { resolveFromRootDir } = require('../utils')
const theme = require(resolveFromRootDir('theme.js'))

module.exports = [
    {
        test: /\.ts(x?)$/,
        use: [
            {
                loader: 'awesome-typescript-loader',
                options: {
                    transpileOnly: true,
                    getCustomTransformers: () => ({
                        before: [
                            tsImportPluginFactory({
                                libraryName: 'antd',
                                libraryDirectory: 'lib',
                                style: true
                            })
                        ]
                    }),
                    exclude: /node_modules/
                }
            },
            {
                loader: 'ts-loader',
                options: {
                    // disable type checker - we will use it in fork plugin
                    transpileOnly: true
                }
            }
        ]
    },
    {
        test: /\.less$/,
        include: [resolveFromRootDir('node_modules')],
        use: [
            'style-loader',
            'css-loader',
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
    },
    {
        test: /\.m?js/,
        resolve: {
            fullySpecified: false
        }
    }
]
