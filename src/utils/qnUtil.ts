// import { UploadFile } from 'antd/lib/upload/interface'

// import { IMAGE_SIZE_LIMIT } from '@constant/index'
// import message from '@components/AntdMessageExt'

// interface UploadData {
//     key?: string
//     token: string
// }

// export interface UploadApiParam {
//     /**
//      * 对应的上传目标bucket, 最终生成为`ydy-${bucket}`,
//      * 默认为staff
//      *
//      * @type {('private' | 'chat' | 'chatroom' | 'staff')}
//      * @memberof UploadApiParam
//      */
//     bucket?: 'private' | 'chat' | 'chatroom' | 'staff'
// }

// /**
//  * 上传资源
//  * 一般用于antd Upload组件的beforeUpload
//  *
//  * @export
//  * @param {(File | UploadFile)} file
//  * @param {number} [limit=IMAGE_SIZE_LIMIT]
//  * @param {UploadApiParam} [apiParam={}]
//  * @returns {Promise<any>}
//  */
// export function upload(file: File | UploadFile, limit = IMAGE_SIZE_LIMIT, apiParam: UploadApiParam = {}): Promise<any> {
//     if (file.size > limit) {
//         const msg = `大小不能超过${(limit / 1024 / 1024).toFixed(1)}M`
//         message.error(msg)
//         return Promise.reject(msg)
//     }
//     return qnUpload(file, apiParam)
// }

// /**
//  * 获取七牛上传的前置数据
//  *
//  * @param {(File | UploadFile)} file
//  * @param {UploadApiParam} [apiParam={}]
//  * @returns {Promise<UploadData>}
//  */
// function qnUpload(file: File | UploadFile, apiParam: UploadApiParam): Promise<UploadData> {
//     const bucket = getUploadSource('bucket', apiParam)
//     return qiniu.getQNTokenV2({ bucket }).then(async res => {
//         const data: UploadData = { token: res }
//         data.key = await generateKey(file as File)
//         return data
//     })
// }

// /**
//  * 获取上传访问的bucket或上传后访问的url前缀
//  *
//  * @export
//  * @param {UploadApiParam} [apiParam={}]
//  * @param {('bucket' | 'urlPrefix')} type
//  * @returns
//  */
// export function getUploadSource(type: 'bucket' | 'urlPrefix', apiParam: UploadApiParam = {}) {
//     const bucket = apiParam.bucket && typeof apiParam.bucket === 'string' ? apiParam.bucket : 'staff'
//     const targetBucket = `ydy${process.env.APP_ENV === 'na' ? '-sc' : ''}-${bucket}`
//     return type === 'bucket' ? targetBucket : `https://${targetBucket}.ydjai.com/`
// }
