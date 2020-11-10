const NODE_ENV = process.env.NODE_ENV
export const SHARE_BASE_URL =
    NODE_ENV === 'development' ? 'http://localhost:8888/#/share-article/' : 'http://note.purevivi.chat/#/share-article/'

// 上传资源大小
export const IMAGE_SIZE_LIMIT = 20 * 1024 * 1024
export const FILE_SIZE_LIMIT = 50 * 1024 * 1024
// 七牛相关
export const QN_UPLOAD_URL = 'https://upload-z2.qiniup.com'
export const QN_BUCKET = 'pure-note'
export const QN_SOURCE_URL = 'https://note.ss.purevivi.chat'

export const LOCALSTORAGE = {
    USERINFO: 'userinfo',
    FILEANDFOLDERDISPLAY: 'fileandfolderdisplay',
    FILEANDFOLDERSORT: 'fileandfoldersort'
}

// 错误图片
export const BREAK_IMAGE = `${QN_SOURCE_URL}/Fih9U9CwldysGx6i3BjfzX2epnab`
