import Http from '@utils/http'

const { post, get } = new Http()

// 新增文件夹
export const createFolder = (data) => {
    return post('folder-add', data)
}

// 获取文件夹树
export const getFolderTree = () => {
    return get('folderTree-get', {})
}

// 获取文件夹
export const getFolder = (data) => {
    return get('folders-get', data)
}

// 删除文件夹
export const delFolder = (data) => {
    return post('folder-del', data)
}

// 彻底删除文件夹
export const delFolderComplete = (data) => {
    return post('folder-del-complete', data)
}

// 获取回收站的文件夹
export const getDelFolder = (data) => {
    return get('del-folders-get', data)
}

// 获取指定文件夹信息
export const getFolderInfo = (data) => {
    return get('folder-info', data)
}

// 获取最新文件夹
export const getNewestFolder = (data) => {
    return get('folder-newest', data)
}

// 搜索文件夹
export const searchFolder = (data) => {
    return get('search-folder', data)
}

// 恢复文件夹
export const recoverFolder = (data) => {
    return post('folder-recover', data)
}

// 重命名
export const renameFolder = (data) => {
    return post('folder-rename', data)
}
