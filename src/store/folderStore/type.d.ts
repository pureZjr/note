import { FolderStore as FolderStoreModel } from './index'

export as namespace IFolderStore

export interface FolderStore extends FolderStoreModel {}

interface FolderBase {
    id?: string
    title?: string
    updateTime?: number
}

interface TreeData extends FolderBase {
    children?: TreeData[]
    key: string
}

interface Folder extends FolderBase {
    key?: string
}
