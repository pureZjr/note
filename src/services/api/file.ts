import Http from '@utils/http'

const { post, get } = new Http()

// 创建文件
export const create = (data) => {
    return post('file-create', data)
}

// 删除文件
export const del = () => {
    return post('file-delete', {})
}

// 彻底删除文件
export const delComplete = (data) => {
    return post('file-del-complete', data)
}

// 恢复笔记
export const recoverFile = (data) => {
    return post('file-recover', data)
}

// 重命名
export const renameFile = (data) => {
    return post('file-rename', data)
}

// 置顶操作
export const setTopFile = (data) => {
    return post('file-setTop', data)
}

// 生成分享文件
export const createShareFileLink = (data) => {
    return post('set-file-share', data)
}

// 取消分享文件
export const cancelShareFile = (data) => {
    return post('set-file-share', data)
}

// 获取分享文件
export const getShareFileLink = (data, noErrTips?) => {
    return get('get-file-share', data, noErrTips)
}

// 新增笔记
export const createFile = (data) => {
    return post('file-add', data)
}

// 获取文件夹下笔记
export const getFileInFolder = (data) => {
    return get('fileInFolder-get', data)
}

// 编辑笔记
export const editFile = (data) => {
    return post('file-edit', data)
}

// 获取笔记
export const getFile = (data) => {
    return get('file-get', data)
}

// 删除文件
export const delFile = (data) => {
    return post('file-del', data)
}

// 彻底删除文件
export const delFileComplete = (data) => {
    return post('file-del-complete', data)
}

// 获取回收站的文件
export const getDelFile = (data) => {
    return get('del-file-get', data)
}

// 获取最新文件
export const getNewestFile = (data) => {
    return get('file-newest', data)
}

// 搜索文件
export const searchFile = (data) => {
    return get('search-file', data)
}

// 获取文件内容
export const getFileContent = (data) => {
    return get('file-content-get', data)
}

// 点赞分享文章
export const likeShareFile = (data) => {
    return post('like-share-file', data)
}

// 最近看过的分享文章
export const recentReadShareFile = (data, noErrTips = false) => {
    return post('recent-read-share-file', data, noErrTips)
}

// 评论分享文章
export const commentShareFile = (data) => {
    return post('comment-share-file', data)
}

// 获取与我分享的文件
export const getShareToMeFile = (data) => {
    return get('share-to-me-file-get', data)
}

// 获取我分享的
export const getMyShareFile = (data) => {
    return get('my-share-file-get', data)
}
