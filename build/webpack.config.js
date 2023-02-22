const TsconfigPathsWebpackPlugin = require('tsconfig-paths-webpack-plugin')
// webpack5自带terser-webpack-plugin
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')

const plugins = require('./plugins')
const jsRules = require('./rules/jsRules')
const styleRules = require('./rules/styleRules')
const fileRules = require('./rules/fileRules')
const { APP_ENV, FILE_EXTENSIONS } = require('./constants')
const { resolveFromRootDir, assetsPath } = require('./utils')
const { assetsRoot } = require('./config')
const optimization = require('./optimization')
require('./cleanup-folder')

const config = {
    mode: APP_ENV,
    entry: {
        app: { import: resolveFromRootDir('src/index.tsx'), dependOn: 'shared' },
        shared: 'lodash',
    },
    devServer: {
        hot: true,
        liveReload: false,
        port: 9001,
    },
    output: {
        publicPath: APP_ENV === 'production' ? 'https://cdn-src.renjianzahuopu.store/release-webpack/product/' : '/',
        path: assetsRoot,
        filename: APP_ENV === 'production' ? assetsPath('js/[name].[chunkhash:19].js') : '[name].js',
    },
    module: {
        rules: [...jsRules, ...styleRules, ...fileRules],
    },
    watchOptions: {
        ignored: /node_modules/,
    },
    plugins: [...plugins, new BundleAnalyzerPlugin()],
    resolve: {
        extensions: FILE_EXTENSIONS,
        plugins: [
            new TsconfigPathsWebpackPlugin({
                configFile: resolveFromRootDir('tsconfig.json'),
            }),
        ],
        fallback: { path: require.resolve('path-browserify') },
    },
    // 开启缓存，加快开发环境构建速度
    optimization,
    devtool: APP_ENV === 'development' ? 'eval-cheap-module-source-map' : false,
    stats: 'minimal',
}

// 开启缓存，加快开发环境构建速度
if (APP_ENV === 'development') {
    config.cache = {
        type: 'filesystem',
        cacheLocation: resolveFromRootDir('.cache'),
    }
}

const smp = new SpeedMeasurePlugin()
webpackConfig = smp.wrap(config)

module.exports = webpackConfig
