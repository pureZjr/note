import { observable, action } from 'mobx'

/**
 * 文章store
 *
 * @export
 * @class ArticleStore
 */

export class ArticleStore {
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
}

export default new ArticleStore()
