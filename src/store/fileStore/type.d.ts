import { FileStore as FileStoreModel } from './index'

export as namespace IFileStore

export interface FileStore extends FileStoreModel {}

export interface File {
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
