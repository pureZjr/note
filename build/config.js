const { resolveFromRootDir } = require('./utils')
const { APP_ENV } = require('./constants')

const assetsRoot = resolveFromRootDir(`dist/${APP_ENV}/`)

module.exports = { assetsRoot }
