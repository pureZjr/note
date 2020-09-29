import { get } from 'lodash'
import axios from 'axios'

import * as store from '@store/index'
import { getFolderInfo } from '@services/api/folder'

/**
 * 计算字符串所占的内存字节数，默认使用UTF-8的编码方式计算，也可制定为UTF-16
 * UTF-8 是一种可变长度的 Unicode 编码格式，使用一至四个字节为每个字符编码
 *
 * 000000 - 00007F(128个代码)      0zzzzzzz(00-7F)                             一个字节
 * 000080 - 0007FF(1920个代码)     110yyyyy(C0-DF) 10zzzzzz(80-BF)             两个字节
 * 000800 - 00D7FF
   00E000 - 00FFFF(61440个代码)    1110xxxx(E0-EF) 10yyyyyy 10zzzzzz           三个字节
 * 010000 - 10FFFF(1048576个代码)  11110www(F0-F7) 10xxxxxx 10yyyyyy 10zzzzzz  四个字节
 *
 * 注: Unicode在范围 D800-DFFF 中不存在任何字符
 * {@link http://zh.wikipedia.org/wiki/UTF-8}
 *
 * UTF-16 大部分使用两个字节编码，编码超出 65535 的使用四个字节
 * 000000 - 00FFFF  两个字节
 * 010000 - 10FFFF  四个字节
 *
 * {@link http://zh.wikipedia.org/wiki/UTF-16}
 * @param  {String} str - 字符串
 * @param  {String} charset utf-8, utf-16
 * @return {Number} - size
 */
export const sizeof = (str, charset) => {
    let total = 0,
        charCode,
        i,
        len
    charset = charset ? charset.toLowerCase() : ''
    if (charset === 'utf-16' || charset === 'utf16') {
        for (i = 0, len = str.length; i < len; i++) {
            charCode = str.charCodeAt(i)
            if (charCode <= 0xffff) {
                total += 2
            } else {
                total += 4
            }
        }
    } else {
        for (i = 0, len = str.length; i < len; i++) {
            charCode = str.charCodeAt(i)
            if (charCode <= 0x007f) {
                total += 1
            } else if (charCode <= 0x07ff) {
                total += 2
            } else if (charCode <= 0xffff) {
                total += 3
            } else {
                total += 4
            }
        }
    }
    return total
}

export const byteConvert = function(bytes) {
    if (isNaN(bytes)) {
        return ''
    }
    let symbols = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    let exp = Math.floor(Math.log(bytes) / Math.log(2))
    if (exp < 1) {
        exp = 0
    }
    let i = Math.floor(exp / 10)
    bytes = bytes / Math.pow(2, 10 * i)

    if (bytes.toString().length > bytes.toFixed(2).toString().length) {
        bytes = bytes.toFixed(2)
    }
    return bytes + ' ' + symbols[i]
}

/**
 * 根据当前的key设置所有父key
 */
export const setAllKeysByCurrKey = (currKey: string) => {
    const { setExpandTreeKeys, setCurrSelectedFolderName } = store.folderStore
    let key = '2'
    const parentKeyLength = (currKey.match(/-/g) || []).length / 5
    const item = currKey.split('-')
    for (let i = 0; i < parentKeyLength; i++) {
        key += `-${item[1 + 5 * i]}-${item[2 + 5 * i]}-${item[3 + 5 * i]}-${item[4 + 5 * i]}-${item[5 + 5 * i]}`
        setExpandTreeKeys(key)
    }
    store.extraStore.getFolderAndFile(currKey)
    getFolderInfo({ key: currKey }).then(res => {
        setCurrSelectedFolderName(get(res, '[0].title', '我的文件夹'))
    })
}

/**
 * 延迟方法
 */
export const delayFun = (delay = 1000) => {
    return new Promise(relolve => {
        setTimeout(() => {
            relolve(true)
        }, delay)
    })
}

/**
 * 复制文本
 */
export function copyToClipboard(text: string): void {
    const aux = document.createElement('textarea')
    aux.innerHTML = text
    document.body.appendChild(aux)
    aux.select()
    document.execCommand('copy')
    document.body.removeChild(aux)
}

/**
 * 下载远程文件 filename需要带后缀
 */

export const downloadRemoteFile = (fileurl: string, filename: string) => {
    return new Promise((resolve, reject) => {
        axios
            .get(fileurl, { responseType: 'blob' })
            .then(response => {
                const a = document.createElement('a')
                const url = window.URL.createObjectURL(new Blob([response.data]))
                a.href = url
                a.download = filename
                a.click()
                window.URL.revokeObjectURL(url)
                resolve(true)
            })
            .catch(err => {
                reject(err)
            })
    })
}
