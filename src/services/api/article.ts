import Http from '@utils/http'

const { post, get } = new Http()

// 新增笔记
export const createArticle = data => {
    return post('article-add', data)
}

// 获取文件夹下笔记
export const getArticleInFolder = data => {
    return get('articleInFolder-get', data)
}

// 编辑笔记
export const editArticle = data => {
    return post('article-edit', data)
}

// 获取笔记
export const getArticle = data => {
    return get('article-get', data)
}

// 删除文件
export const delFile = data => {
    return post('article-del', data)
}

// 彻底删除文件
export const delArticleComplete = data => {
    return post('article-del-complete', data)
}

// 获取回收站的文件
export const getDelArticle = () => {
    return get('del-article-get', {})
}

// 获取回收站的文件
export const getNewestArticle = data => {
    return get('article-newest', data)
}

// 搜索文件
export const searchArticle = data => {
    return get('search-article', data)
}

// 获取笔记内容
export const getArticleContent = data => {
    return get('article-content-get', data)
}

// 恢复笔记
export const recoverArticle = data => {
    return post('article-recover', data)
}

// 重命名
export const renameArticle = data => {
    return post('article-rename', data)
}

// 置顶操作
export const setTopArticle = data => {
    return post('article-setTop', data)
}

// 生成分享文章
export const createShareArticleLink = data => {
    return post('set-article-share', data)
}

// 获取分享文章
export const getShareArticleLink = data => {
    return get('get-article-share', data)
}
