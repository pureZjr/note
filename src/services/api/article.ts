import Http from '@utils/http'

const { post, get } = new Http()

// 获取笔记内容
export const getArticleContent = data => {
    return get('article-content-get', data)
}
