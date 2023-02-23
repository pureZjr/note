const { exec } = require('child_process')

// 资源上传到七牛
class UploadToQiniuPlugin {
    constructor(options) {}

    apply(compiler) {
        // 在emit阶段插入钩子函数
        compiler.hooks.afterEmit.tapPromise('UploadToQiniuPlugin', (compilation) => {
            return new Promise((resolve, reject) => {
                // 上传数量
                const uploadCount = Object.keys(compilation.assets).length
                // 已上传数量
                let currentUploadedCount = 0
                let globalError = null
                // 遍历资源文件
                for (const filePath of Object.keys(compilation.assets)) {
                    // 上传
                    if (!filePath.endsWith('.html')) {
                        exec(
                            `qshell fput renjianzahuopu-src release-webpack/production/${filePath} ${
                                compiler.outputPath + filePath
                            }`,
                            (error, stdout, stderr) => {
                                currentUploadedCount++
                                if (error) {
                                    globalError = error
                                }
                                if (currentUploadedCount === uploadCount) {
                                    globalError ? reject(globalError) : resolve()
                                }
                            }
                        )
                    } else {
                        currentUploadedCount++
                    }
                }
            })
        })
    }
}

// 输出打包文件清单
class FileListPlugin {
    constructor(options) {
        this.name = options.name || 'fileList.md'
    }

    apply(compiler) {
        compiler.hooks.emit.tapAsync('FileListPlugin', (compilation, cb) => {
            const len = Object.keys(compilation.assets).length

            let content = `### 一共有${len}个文件\n\n`

            for (let filename in compilation.assets) {
                content += `- ${filename}\n`
            }

            compilation.assets[this.name] = {
                source: function () {
                    return content
                },
                size: function () {
                    return content.length
                },
            }
            cb()
        })
    }
}

module.exports = { UploadToQiniuPlugin, FileListPlugin }
