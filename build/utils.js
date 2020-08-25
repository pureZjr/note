const path = require('path')

exports.resolveFromRootDir = function(dir) {
    return path.join(__dirname, './../', dir)
}
