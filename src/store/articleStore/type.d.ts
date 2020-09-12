import { ArticleStore as ArticleStoreModel } from './index'

export as namespace IArticleStore

export interface ArticleStore extends ArticleStoreModel {}

export interface IArticle {
    id?: string
    title?: string
    createTime?: number
    updateTime?: number
    inRecycle?: boolean
    type?: IExtraStore.CreateType
    content?: string
    size?: number
    parentId?: string
    key?: string
    parentKey?: string
    parentFolderTitle?: string
    isTop?: 0 | 1
    tags?: string[]
}
