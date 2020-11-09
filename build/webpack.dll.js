const path = require('path')
const webpack = require('webpack')

module.exports = {
    entry: {
        library: ['react', 'react-dom','wangeditor','react-router-dom','moment','mobx-react','mobx-react-router','mobx',]
    },
    output: {
        filename: '[name]_[chunkhash].dll.js',
        path: path.resolve(__dirname, './build/library'),
        library: '[name]'
    },
    resolve: {
        fallback: { path: require.resolve('path-browserify') }
    },
    plugins: [
        new webpack.DllPlugin({
            name: '[name]_[hash]',
            path: path.resolve(__dirname, './build/library/[name].json')
        })
    ]
}
