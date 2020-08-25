'use strict'

const fs = require('fs')
const path = require('path')

const NODE_ENV = process.env.NODE_ENV
const APP_ENV = process.env.APP_ENV || NODE_ENV

const dotenv = path.join(process.cwd(), '.env')

if (!NODE_ENV) {
    throw new Error('The NODE_ENV environment variable is required but was not specified.')
}

const dotenvFiles = [
    `${dotenv}.${APP_ENV}.local`,
    `${dotenv}.${APP_ENV}`,
    // Dont't include `.env.local` for `test` environment
    // since normally you expect tests to produce the same
    // results for everyone
    APP_ENV !== 'test' && `${dotenv}.local`,
    dotenv
]

for (let dotenvFile of dotenvFiles) {
    if (fs.existsSync(dotenvFile)) {
        require('dotenv-expand')(
            require('dotenv').config({
                path: dotenvFile
            })
        )
        break
    }
}

const REACT_APP = /^REACT_APP_/i

function getClientEnvironment(publicUrl) {
    // 1. 获取所有环境变量
    // 2. 过滤掉不是以REACT_APP_开头的变量
    // 3. 给环境变量对象增加变量
    const raw = Object.keys(process.env)
        .filter(key => REACT_APP.test(key))
        .reduce(
            (env, key) => {
                env[key] = process.env[key]
                return env
            },
            {
                NODE_ENV: process.env.NODE_ENV || 'development',
                PUBLIC_URL: publicUrl
            }
        )
    // 字符串化
    const stringified = {
        'process.env': Object.keys(raw).reduce((env, key) => {
            env[key] = JSON.stringify(raw[key])
            return env
        }, {})
    }
    return { raw, stringified }
}

module.exports = getClientEnvironment
