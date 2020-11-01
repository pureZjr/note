const tsImportPluginFactory = require('ts-import-plugin')

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
        test: /\.m?js/,
        resolve: {
            fullySpecified: false
        }
    }
]
