const fs = require('fs')
const { exec } = require('child_process')
const path = require('path')

const buildPath = path.resolve(__dirname, './dist/production')

const uploadFiles = (folderPath) => {
    fs.readdir(folderPath, (err, files) => {
        files.forEach((file) => {
            const filePath = `${folderPath}/${file}`
            fs.stat(filePath, (err, stat) => {
                if (stat) {
                    if (stat.isDirectory()) {
                        uploadFiles(filePath)
                    } else {
                        if (!filePath.endsWith('.html')) {
                            exec(
                                `qshell fput renjianzahuopu-src release-webpack/product${filePath.replace(
                                    buildPath,
                                    ''
                                )} ${filePath}`,
                                (error, stdout, stderr) => {
                                    if (error) {
                                        console.error(`exec error: ${error}`)
                                        throw error
                                    }
                                }
                            )
                        }
                    }
                }
            })
        })
    })
}

uploadFiles(buildPath)
