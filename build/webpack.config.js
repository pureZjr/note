const TsconfigPathsWebpackPlugin = require('tsconfig-paths-webpack-plugin')

const plugins = require('./plugins')
const jsRules = require('./rules/jsRules')
const styleRules = require('./rules/styleRules')
const fileRules = require('./rules/fileRules')
const { resolveFromRootDir } = require('./utils')

module.exports = {
    entry: {
        app: resolveFromRootDir('src/index.tsx')
    },
    output: {
        path: resolveFromRootDir('dist'),
        filename: '[name].js'
    },
    module: {
        rules: [...jsRules, ...styleRules, ...fileRules]
    },
    plugins: [...plugins],
    resolve: {
        extensions: ['.ts', '.tsx', '.js', 'jsx'],
        plugins: [
            new TsconfigPathsWebpackPlugin({
                configFile: resolveFromRootDir('tsconfig.json')
            })
        ]
    }
}
