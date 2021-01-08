const path = require('path')

const { assetsSubDirectory } = require('./constants')

exports.resolveFromRootDir = function(dir = '') {
    return path.join(__dirname, './../', dir)
}

exports.assetsPath = function(_path) {
    return path.posix.join(assetsSubDirectory, _path)
}
