const tsImportPluginFactory = require('ts-import-plugin')

module.exports = [
    {
        test: /\.ts(x?)$/,
        use: [
            {
                loader: 'thread-loader',
            },
            {
                loader: 'ts-loader',
                options: {
                    // disable type checker - we will use it in fork plugin
                    // 关闭类型检查，通过 ForkTsCheckerWebpackPlugin 做
                    transpileOnly: true,
                    // 使用happypack 或者 thread-loader 并行构建时候，设置true
                    happyPackMode: true,
                    getCustomTransformers: () => ({
                        before: [
                            tsImportPluginFactory({
                                libraryName: 'antd',
                                libraryDirectory: 'lib',
                                style: true,
                            }),
                        ],
                    }),
                    compilerOptions: {
                        module: 'es2015',
                    },
                },
            },
        ],
    },
    {
        test: /\.m?js/,
        resolve: {
            fullySpecified: false,
        },
    },
]
