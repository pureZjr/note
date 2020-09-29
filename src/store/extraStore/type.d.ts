import { ExtraStore as ExtraStoreModal } from './index'

export as namespace IExtraStore

interface ExtraStore extends ExtraStoreModal {}

enum CreateType {
    MarkDown = 'markdown',
    Folder = 'folder',
    Article = 'article',
    Img = 'image',
    Video = 'video'
}

export interface IMenuProps {
    x?: number
    y?: number
    visible?: boolean
    // 当前文件夹id
    folderId?: string
    // 当前文章id
    articleId?: string
    key?: string
    isFolder?: boolean
    // 是文件夹树
    isTree?: boolean
    type?: CreateType
    // 当前文件夹或文章的标题
    title?: string
    // 置顶
    isTop?: 0 | 1
}
