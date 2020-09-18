const NODE_ENV = process.env.NODE_ENV
export const SHHARE_BASE_URL =
    NODE_ENV === 'development' ? 'http://localhost:8888/#/share-article/' : 'http://note.purevivi.chat/#/share-article/'

// 上传文件默认限制大小
export const IMAGE_SIZE_LIMIT = 20 * 1024 * 1024
export const QN_UPLOAD_URL = 'https://upload-z2.qiniup.com'
export const QN_BUCKET = 'pure-note'
export const QN_SOURCE_URL = 'http://qfz0ncp9r.hn-bkt.clouddn.com'

export const LOCALSTORAGE = {
    USERINFO: 'userinfo'
}
