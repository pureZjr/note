import { observable, action } from 'mobx'

import { getArticleInFolder } from '@services/api/article'

/**
 * 文章store
 *
 * @export
 * @class ArticleStore
 */

export class ArticleStore {
    /**
     * 文章列表
     *
     * @memberof ArticleStore
     */
    @observable
    articles: IArticleStore.IArticle[] = []
    @action
    setArticles = (articles: IArticleStore.IArticle[]) => {
        this.articles = articles
    }

    /**
     * 获取文章
     *
     * @memberof ArticleStore
     */
    getArticles = async (parentKey: string) => {
        const res = await getArticleInFolder({ parentKey })
        this.setArticles(res)
        return res
    }

    /**
     * 当前选中文章的信息
     *
     * @memberof ArticleStore
     */
    @observable
    currArticleId: string = null
    @action
    setCurrArticleId = (id: string) => {
        this.currArticleId = id
    }

    /**
     * 更新文章
     *
     * @memberof ArticleStore
     */
    @action
    updateArticle = (args: IArticleStore.IArticle) => {
        const arr = [...this.articles]
        const index = arr.findIndex(a => a.id === args.id)
        arr[index] = {
            ...arr[index],
            ...args
        }
        this.setArticles(arr)
    }

    /**
     * 文章内容
     *
     * @memberof ArticleStore
     */
    @observable
    articleContent = ''
    @action
    setArticleContent = (content: string) => {
        this.articleContent = content
    }

    /**
     * 获取文章loading
     *
     * @memberof ArticleStore
     */
    @observable
    contentLoading = false
    @action
    setContentLoading = (boo: boolean) => {
        this.contentLoading = boo
    }

    /**
     * 删除文章
     *
     * @memberof ArticleStore
     */
    @action
    delArticle = (id: string) => {
        const arr = JSON.parse(JSON.stringify(this.articles))
        const idx = this.articles.findIndex(v => v.id === id)
        arr.splice(idx, 1)
        this.setArticles(arr)
    }

    /**
     * 插入文章
     *
     * @memberof ArticleStore
     */
    @action
    insertArticle = (article: IArticleStore.IArticle) => {
        const arr = JSON.parse(JSON.stringify(this.articles))
        arr.splice(0, 0, article)
        this.setArticles(arr)
    }
}

export default new ArticleStore()
